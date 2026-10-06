export interface Profile {
  id: number
  name: string
  title: string
  bio: string
  email: string
  avatar_url: string
  title_en?: string
  title_ja?: string
  bio_en?: string
  bio_ja?: string
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
  position_en?: string
  position_ja?: string
  workplace_en?: string
  workplace_ja?: string
}

export interface Education {
  id: number
  university: string
  degree: string
  year: string
  location: string
  degree_en?: string
  degree_ja?: string
  location_en?: string
  location_ja?: string
  university_en?: string
  university_ja?: string
}

export interface Certification {
  id: number
  title: string
  issuer: string
  year: string
  issuer_logo_url?: string
  title_en?: string
  title_ja?: string
  issuer_en?: string
  issuer_ja?: string
  image_url?: string
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
  title_en?: string
  title_ja?: string
  description_en?: string
  description_ja?: string
  image_url?: string
}
