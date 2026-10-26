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
  location?: string
  location_en?: string
  location_ja?: string
  description?: string
  description_en?: string
  description_ja?: string
  on_cv?: boolean
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
  on_cv?: boolean
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
  on_cv?: boolean
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
  impact?: string
  impact_en?: string
  impact_ja?: string
  on_cv?: boolean
}

export interface CvMatrixRow {
  label: string
  label_en?: string
  label_ja?: string
  value: string
  value_en?: string
  value_ja?: string
}

export interface CvStrength {
  text: string
  text_en?: string
  text_ja?: string
}

export interface CvSkillsets {
  hard?: string
  hard_en?: string
  hard_ja?: string
  soft?: string
  soft_en?: string
  soft_ja?: string
}

export interface CvContent {
  id: number
  name?: string
  role?: string
  email?: string
  phone?: string
  linkedin?: string
  website?: string
  meta_location?: string
  meta_location_en?: string
  meta_location_ja?: string
  meta_exp?: string
  meta_exp_en?: string
  meta_exp_ja?: string
  summary?: string
  summary_en?: string
  summary_ja?: string
  matrix?: CvMatrixRow[]
  skillsets?: CvSkillsets
  strengths?: CvStrength[]
}
