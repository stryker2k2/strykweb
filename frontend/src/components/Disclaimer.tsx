import { Link } from '../lib/router'

export default function Disclaimer() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Disclaimer</h1>

        <dl className="text-gray-500 text-sm mb-8 space-y-1">
          <div>
            <dt className="inline font-semibold text-gray-400">Applies to:</dt>{' '}
            <dd className="inline">
              the private-server editions of Stryk's Emote Wheel — the Turtle WoW / Capybara Paradise
              edition and the Project Ascension edition.
            </dd>
          </div>
          <div>
            <dt className="inline font-semibold text-gray-400">Effective date:</dt>{' '}
            <dd className="inline">August 2, 2026</dd>
          </div>
        </dl>

        <p className="text-gray-400 leading-relaxed mb-8">
          Turtle WoW, Capybara Paradise, Project Ascension, and other Turtle WoW inspired servers
          (collectively, "the Projects") are private World of Warcraft servers not operated or endorsed by
          Blizzard Entertainment. This disclaimer covers the editions of the addon built for those Projects.
          The separate Blizzard World of Warcraft edition of this addon is developed and used like any
          other publicly-distributed addon — including on the Author's own retail and Classic accounts on
          official Blizzard realms — and is not addressed here.
        </p>

        <div className="space-y-8 text-gray-400 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">No Affiliation</h2>
            <p>
              The author of this addon, stryker2k2 ("the Author"), is not, and has never been, a member of
              the development, administrative, moderation, or support team of Turtle WoW, Capybara
              Paradise, Project Ascension, or any other private server related to those Projects. The
              Author holds no employment, contractual, or organizational relationship with the Projects or
              their operators.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">No Compensation</h2>
            <p>
              The Author has not received, solicited, or been offered any monetary payment, cryptocurrency,
              in-game currency or items, subscription credit, or any other form of compensation — direct or
              indirect — from the Projects, their operators, or any affiliated party in connection with the
              design, development, maintenance, or distribution of this addon.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">No Connection to Private Servers</h2>
            <p className="mb-3">
              Connecting to an unauthorized private World of Warcraft server over the internet can carry
              real legal and Terms-of-Service risk. For that reason, the Author has never connected to
              Turtle WoW, Capybara Paradise, Project Ascension, or any other private server over a network,
              and has never had network access to, administrative access to, or possession of any of the
              Projects' server-side infrastructure, source code, databases, or backend systems.
            </p>
            <p>
              All design, development, testing, and debugging of these editions was performed entirely
              offline, using local, non-internet-connected installations of the respective game clients.
              This addon interacts solely with the standard client-side Lua/XML addon API exposed by those
              clients — the same public interface available to every player — and does not read from,
              write to, or otherwise communicate with any server backend.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Nature of This Software</h2>
            <p>
              This addon is a client-side user-interface convenience tool: a radial emote-selection menu.
              It does not alter game mechanics, does not interact with server memory or network traffic
              beyond the client's own standard addon API, and confers no gameplay advantage.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Trademarks</h2>
            <p>
              World of Warcraft is a trademark or registered trademark of Blizzard Entertainment, Inc. Any
              other names of games, servers, or projects referenced on this site are used solely for
              descriptive and interoperability purposes, to identify the client environments this software
              is compatible with. No trademark rights, sponsorship, or endorsement are claimed or implied.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-gray-950 font-semibold px-7 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}
