interface Experience {
  id: number
  role: string
  company: string
  period: string
  description: string
}

interface Project {
  id: number
  title: string
  category: string
  image: string
  tech: string[]
}

interface UserProfile {
  name: string
  role: string
  location: string
  email: string
  phone: string
  website: string
  about: string
  avatar: string
  coverImage: string
  skills: string[]
  experiences: Experience[]
  projects: Project[]
  socials: {
    github: string
    linkedin: string
    twitter: string
  }
}
