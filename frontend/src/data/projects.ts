import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'stryks-emote-wheel',
    name: "Stryk's Emote Wheel",
    description: 'A draggable 12-slice radial emote menu for World of Warcraft. Assign any of 145+ emotes to the wheel, pick from 13 color themes, bind a key or controller button, and fire emotes without ever opening a menu.',
    version: '1.1.3',
    game: 'Blizzard World of Warcraft',
    downloadUrl: '/dist/blizzard/StryksEmoteWheel-1.1.3.zip',
    curseforgeUrl: 'https://www.curseforge.com/wow/addons/stryks-emote-wheel',
    tags: ['Retail (12.0.5)', 'Classic Era (1.15.8)', 'TBC (2.5.5)', 'MoP Classic (5.5.3)'],
    releaseDate: '2026-05-08',
    icon: '/images/emote_wheel/icon_512.png',
    screenshots: [
      '/images/emote_wheel/screenshot_001.png',
      '/images/emote_wheel/screenshot_002.png',
      '/images/emote_wheel/screenshot_003.png',
      '/images/emote_wheel/screenshot_004.png',
      '/images/emote_wheel/screenshot_005.png',
    ],
  },
  {
    id: 'stryks-emote-wheel-custom',
    name: "Stryk's Emote Wheel",
    description: 'The custom server edition of Stryk\'s Emote Wheel — same 12-slice radial menu and full feature set, built for Turtle WoW and Turtle WoW inspired private servers.',
    version: '1.0.1',
    game: 'Turtle WoW & Inspired Servers',
    downloadUrl: '/dist/capybara/StryksEmoteWheel-1.0.1.zip',
    curseforgeUrl: 'https://www.curseforge.com/wow/addons/stryks-emote-wheel',
    tags: ['Turtle WoW (1.18.1)', 'Capybara (1.18.1)'],
    releaseDate: '2026-05-08',
    icon: '/images/emote_wheel/icon_512.png',
    screenshots: [
      '/images/emote_wheel/custom_001.png',
    ],
  },
  {
    id: 'stryks-emote-wheel-ascension',
    name: "Stryk's Emote Wheel",
    description: 'The Project Ascension edition of Stryk\'s Emote Wheel — same 12-slice radial menu and full feature set, built for Ascension\'s WotLK-based custom client.',
    version: '1.0.0',
    game: 'Project Ascension',
    downloadUrl: '/dist/ascension/StryksEmoteWheel-1.0.0.zip',
    curseforgeUrl: 'https://www.curseforge.com/wow/addons/stryks-emote-wheel',
    tags: ['Project Ascension (3.3.5a)'],
    releaseDate: '2026-08-01',
    icon: '/images/emote_wheel/icon_512.png',
    screenshots: [
      '/images/emote_wheel/ascension_001.png',
    ],
  },
]
