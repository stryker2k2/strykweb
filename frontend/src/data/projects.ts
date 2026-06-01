import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'stryks-emote-wheel',
    name: "Stryk's Emote Wheel",
    description: 'A draggable 12-slice radial emote menu for World of Warcraft. Assign any of 145+ emotes to the wheel, pick from 13 color themes, bind a key or controller button, and fire emotes without ever opening a menu.',
    version: '1.1.1',
    game: 'World of Warcraft',
    downloadUrl: '/downloads/StryksEmoteWheel-1.1.1.zip',
    githubUrl: 'https://github.com/stryker2k2/emote_wheel',
    tags: ['Retail', 'Classic Era', 'TBC', 'MoP Classic', 'UI', 'Emote'],
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
]
