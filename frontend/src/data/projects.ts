import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'my-addon',
    name: 'MyAddon',
    description: 'A World of Warcraft addon. Replace this with your real addon name and description.',
    version: '1.0.0',
    game: 'World of Warcraft',
    downloadUrl: '/downloads/MyAddon-1.0.0.zip',
    githubUrl: 'https://github.com/yourusername/MyAddon',
    tags: ['WoW', 'Addon'],
    releaseDate: '2024-01-01',
  },
]
