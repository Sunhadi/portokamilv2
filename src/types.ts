export interface Profile {
  id: number
  name: string
  title: string
  bio: string
  email: string
  avatar_url: string
}

export interface SocialLinks {
  id: number
  github: string
  linkedin: string
  gitlab: string
  twitter: string
  instagram: string
  youtube: string
  website: string
}

export interface Experience {
  id: number
  year: string
  position: string
  workplace: string
}

export interface Education {
  id: number
  university: string
  degree: string
  year: string
  location: string
}

export interface Certification {
  id: number
  title: string
  issuer: string
  year: string
}

export interface Skill {
  id: number
  name: string
  level: number
}

export interface Project {
  id: number
  title: string
  description: string
  tech_stack: string
  live_url: string
  repo_url: string
}
