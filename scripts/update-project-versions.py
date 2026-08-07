#!/usr/bin/env python3
# Scans dist/{flavor}/ for the newest {name}-{version}.zip per flavor and
# updates the matching project's `version`, `downloadUrl`, `releaseDate`,
# and `tags` fields in frontend/src/data/projects.ts, so a fresh addon
# drop doesn't require a manual edit. `releaseDate` is set to the date the
# script runs, but only when it finds an actual version bump — a tags-only
# refresh (see below) doesn't touch it.
#
# The flavor to update is inferred from each project's existing downloadUrl
# (e.g. '/dist/blizzard/...' -> dist/blizzard/). Within that folder, the
# *newest* '*-{version}.zip' wins regardless of what comes before the
# version — each flavor folder holds exactly one addon's zips, so the
# naming convention in between (e.g. plain 'StryksEmoteWheel-1.1.4.zip' for
# blizzard vs. 'StryksEmoteWheel-Ascension-1.0.1.zip' for ascension) doesn't
# need to match anything, and can differ per flavor or change over time
# without breaking this script. Tags are refreshed from the
# ## Interface / ## X-WoW-Version lines of the .toc file(s) inside that
# zip, since the client version a build supports can change (e.g. a patch
# bump) even when the addon's own version number doesn't.
#
# Two .toc shapes are handled:
#  - A flavor with exactly one .toc file (e.g. capybara, ascension): its
#    version (preferring `## X-WoW-Version:` when present, since private
#    servers can't be inferred from the Interface number alone) is applied
#    to every existing tag for that project, title unchanged. This is how
#    one Turtle-WoW-flavored build ends up refreshing both the
#    'Turtle WoW (...)' and 'Capybara (...)' tags.
#  - A flavor with multiple .toc files (blizzard: one per expansion), each
#    is classified into a family (Retail/Classic Era/TBC/Wrath/Cata/MoP)
#    from its Interface number, matched by keyword against the existing
#    tag titles, and only that tag's version is updated. A .toc whose
#    family doesn't match any existing tag is reported and left alone —
#    this script updates versions on tags a human already created, it
#    doesn't invent new ones.
#
# Not handled: a single .toc listing multiple comma-separated Interface
# numbers, or Blizzard's newer `## Interface-Retail:`-style per-flavor
# keys in one file — this addon ships one .toc per expansion instead.
#
# Usage:
#   python3 scripts/update-project-versions.py          # apply changes
#   python3 scripts/update-project-versions.py --dry-run
#   (or `make update-versions`)
import argparse
import re
import sys
import zipfile
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = REPO_ROOT / "dist"
PROJECTS_TS = REPO_ROOT / "frontend/src/data/projects.ts"

# Matches a single project object literal. Safe because no field in a
# project (screenshots, tags, etc.) uses curly braces internally.
BLOCK_RE = re.compile(r"\{[^{}]*\}")
DOWNLOAD_URL_RE = re.compile(
    r"downloadUrl:\s*'/dist/(?P<flavor>[^/]+)/(?P<base>.+?)-(?P<version>\d+\.\d+\.\d+)\.zip'"
)
VERSION_LINE_RE = re.compile(r"version:\s*'\d+\.\d+\.\d+'")
RELEASE_DATE_RE = re.compile(r"releaseDate:\s*'\d{4}-\d{2}-\d{2}'")
TAGS_LINE_RE = re.compile(r"tags:\s*\[(?P<items>[^\]]*)\]")
TAG_ITEM_RE = re.compile(r"'([^']*)'")
INTERFACE_RE = re.compile(r"^##\s*Interface:\s*(\d+)", re.MULTILINE)
X_WOW_VERSION_RE = re.compile(r"^##\s*X-WoW-Version:\s*(\S+)", re.MULTILINE)

# Interface number -> expansion family, keyed by digit count and leading
# digit(s). Blizzard's own convention: 6-digit interface numbers are
# Retail; 5-digit ones start with the expansion's classic-era digit.
FAMILY_BY_LEADING_DIGIT = {
    "1": "Classic Era",
    "2": "TBC",
    "3": "Wrath",
    "4": "Cata",
    "5": "MoP",
}
# Keywords used to match a family back to an existing tag's title text.
FAMILY_KEYWORDS = {
    "Retail": ["retail"],
    "Classic Era": ["classic era"],
    "TBC": ["tbc", "burning crusade"],
    "Wrath": ["wrath", "wotlk"],
    "Cata": ["cata"],
    "MoP": ["mop", "mists"],
}


ZIP_VERSION_RE = re.compile(r"^.+-(\d+\.\d+\.\d+)\.zip$")


def latest_version(flavor_dir: Path) -> tuple[str, str] | None:
    """Returns (version_string, filename) for the newest *-{version}.zip in flavor_dir, or None.

    Deliberately doesn't check what comes before the version — each
    dist/{flavor}/ folder holds exactly one addon's zips, so whatever the
    naming convention is (with or without a '-{Flavor}' infix), the file
    with the highest version wins.
    """
    best: tuple[tuple[int, ...], str, str] | None = None
    if not flavor_dir.is_dir():
        return None
    for f in flavor_dir.iterdir():
        m = ZIP_VERSION_RE.match(f.name)
        if not m:
            continue
        version = m.group(1)
        key = tuple(int(p) for p in version.split("."))
        if best is None or key > best[0]:
            best = (key, version, f.name)
    return (best[1], best[2]) if best else None


def interface_to_version(interface: str) -> tuple[str, str | None]:
    """Returns (version_string, family). family is None for 6-digit (Retail) numbers."""
    if len(interface) == 6:
        major, minor, patch = interface[0:2], interface[2:4], interface[4:6]
        return f"{int(major)}.{int(minor)}.{int(patch)}", "Retail"
    if len(interface) == 5:
        major, minor, patch = interface[0], interface[1:3], interface[3:5]
        family = FAMILY_BY_LEADING_DIGIT.get(interface[0])
        return f"{int(major)}.{int(minor)}.{int(patch)}", family
    return interface, None


def read_toc_versions(zip_path: Path) -> list[tuple[str, str | None]]:
    """Returns a list of (version, family) for each .toc file in the zip.

    family is always derived from the Interface number (used to match a
    .toc to the right tag when a flavor ships more than one). The version
    string itself prefers `## X-WoW-Version:` when present, since private
    servers can encode things (e.g. "3.3.5a") the Interface number can't;
    it falls back to the Interface-derived version otherwise. A .toc with
    neither line is skipped.
    """
    results = []
    with zipfile.ZipFile(zip_path) as zf:
        for name in zf.namelist():
            if not name.lower().endswith(".toc"):
                continue
            text = zf.read(name).decode("utf-8", errors="replace")
            iface = INTERFACE_RE.search(text)
            derived_version, family = interface_to_version(iface.group(1)) if iface else (None, None)
            x_wow = X_WOW_VERSION_RE.search(text)
            version = x_wow.group(1) if x_wow else derived_version
            if version is None:
                continue
            results.append((version, family))
    return results


def match_family_tag(tags: list[str], family: str) -> int | None:
    keywords = FAMILY_KEYWORDS.get(family, [])
    for i, tag in enumerate(tags):
        title = tag.rsplit("(", 1)[0].strip().lower()
        if any(kw in title for kw in keywords):
            return i
    return None


def warn(problems: list[str], label: str, message: str) -> None:
    text = f"WARNING: {label}: {message}"
    problems.append(text)
    print(text, file=sys.stderr)


def update_tags(tags: list[str], toc_versions: list[tuple[str, str | None]], label: str, problems: list[str]) -> list[str]:
    tags = list(tags)

    def replace_version(tag: str, new_version: str) -> str:
        title = tag.rsplit("(", 1)[0].strip()
        return f"{title} ({new_version})"

    if len(toc_versions) == 1:
        new_version, _family = toc_versions[0]
        for i, tag in enumerate(tags):
            old_title_and_version = tag
            updated = replace_version(tag, new_version)
            if updated != old_title_and_version:
                print(f"    tag '{tag}' -> '{updated}'")
                tags[i] = updated
        return tags

    for new_version, family in toc_versions:
        if family is None:
            warn(problems, label, ".toc has no Interface/X-WoW-Version match usable for tagging, skipped")
            continue
        idx = match_family_tag(tags, family)
        if idx is None:
            warn(problems, label, f"no existing tag matches family '{family}' ({new_version}) — add one manually")
            continue
        updated = replace_version(tags[idx], new_version)
        if updated != tags[idx]:
            print(f"    tag '{tags[idx]}' -> '{updated}'")
            tags[idx] = updated
    return tags


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="report changes without writing")
    args = parser.parse_args()

    content = PROJECTS_TS.read_text()
    changed = False
    problems: list[str] = []

    def update_block(match: re.Match) -> str:
        nonlocal changed
        block = match.group(0)
        url_match = DOWNLOAD_URL_RE.search(block)
        if not url_match:
            return block

        flavor = url_match.group("flavor")
        base = url_match.group("base")
        current_version = url_match.group("version")
        label = f"{flavor}/{base}"

        found = latest_version(DIST_DIR / flavor)
        if not found:
            warn(
                problems,
                label,
                f"no *-<version>.zip files found in dist/{flavor}/ at all — is the folder empty, "
                "or did the file extension/version format change?",
            )
            return block

        new_version, filename = found
        if new_version == current_version:
            print(f"  {label}: already up to date ({current_version})")
        else:
            print(f"  {label}: {current_version} -> {new_version}")
            changed = True
            block = VERSION_LINE_RE.sub(f"version: '{new_version}'", block, count=1)
            block = DOWNLOAD_URL_RE.sub(f"downloadUrl: '/dist/{flavor}/{filename}'", block, count=1)
            block = RELEASE_DATE_RE.sub(f"releaseDate: '{date.today().isoformat()}'", block, count=1)

        tags_match = TAGS_LINE_RE.search(block)
        if not tags_match:
            return block

        current_tags = TAG_ITEM_RE.findall(tags_match.group("items"))
        toc_versions = read_toc_versions(DIST_DIR / flavor / filename)
        if not toc_versions:
            warn(problems, label, f"no .toc files found inside {filename}, tags left alone")
            return block

        updated_tags = update_tags(current_tags, toc_versions, label, problems)
        if updated_tags != current_tags:
            changed = True
            new_tags_str = "tags: [" + ", ".join(f"'{t}'" for t in updated_tags) + "]"
            block = TAGS_LINE_RE.sub(new_tags_str, block, count=1)

        return block

    updated = BLOCK_RE.sub(update_block, content)

    if changed and not args.dry_run:
        PROJECTS_TS.write_text(updated)
        print(f"\nUpdated {PROJECTS_TS.relative_to(REPO_ROOT)}")
    elif changed:
        print("\n(dry run — not writing changes)")
    else:
        print("No changes needed.")

    if problems:
        print(f"\n{len(problems)} problem(s) need attention (see WARNING lines above):", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
