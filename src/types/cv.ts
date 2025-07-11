export interface Header {
  name: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: { id: string; text: string; }[];
  romeCode?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // e.g., 1-5
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
}

export interface Testimonial {
  id: string;
  company: string;
  text: string;
  author: {
    name: string;
    role: string;
  };
}

export interface CVData {
  header: Header;
  experience: {
    items: Experience[];
  };
  education: {
    items: Education[];
  };
  skills: {
    categories: SkillCategory[];
  };
  projects: {
    items: Project[];
  };
  services: {
    items: Service[];
  };
  testimonials: {
    items: Testimonial[];
  };
}
