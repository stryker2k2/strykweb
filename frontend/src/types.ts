export interface Project {
  id: string
  name: string
  description: string
  version: string
  game?: string
  downloadUrl: string
  githubUrl?: string
  tags: string[]
  releaseDate: string
  icon?: string
  screenshots?: string[]
}
