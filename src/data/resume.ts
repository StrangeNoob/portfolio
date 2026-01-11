export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  technologies: string[];
  category: "web" | "mobile" | "ai" | "backend" | "fullstack" | "frontend";
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  metrics?: string[];
}

export interface Skill {
  name: string;
  category:
    | "frontend"
    | "backend"
    | "mobile"
    | "cloud"
    | "database"
    | "ai"
    | "tools";
  proficiency: number; // 1-100
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const personalInfo = {
  name: "Prateek Kumar Mohanty",
  title: "Full Stack Developer",
  tagline:
    "Building performant, scalable applications with modern technologies",
  email: "itsprateekmohanty@gmail.com",
  location: "India",
  yearsOfExperience: 4,
  bio: `Full Stack Developer with 4+ years of experience crafting high-performance web and mobile applications.
  Passionate about optimizing systems, building AI-powered solutions, and delivering exceptional user experiences.
  Currently focused on API optimization, RAG systems, and cross-platform development.`,
  resumeUrl: "/pdf/Prateek%20Kumar%20Mohanty.pdf",
};

export const experiences: Experience[] = [
  {
    id: "pathfndr",
    company: "Pathfndr",
    role: "SDE II",
    location: "Remote",
    startDate: "Jan 2026",
    endDate: null,
    description:
      "Leading development of travel technology solutions with focus on performance optimization and AI integration.",
    achievements: [
      "Optimized API response time from 20s to 300-700ms, achieving 97% improvement",
      "Built RAG system enabling natural language hotel search",
      "Published 2 iOS applications to the App Store",
      "Deployed 3 microservices on GCP infrastructure",
      "Developed hotel aggregator fetching 1.2K+ hotels in <10 seconds",
    ],
    technologies: [
      "React",
      "Node.js",
      "Python",
      "GCP",
      "RAG",
      "Flutter",
      "PostgreSQL",
    ],
  },
  {
    id: "dextr-labs",
    company: "Dextr Labs",
    role: "Full Stack Developer",
    location: "Remote",
    startDate: "Jun 2024",
    endDate: "Dec 2025",
    description:
      "Built Web3 applications and implemented robust CI/CD pipelines.",
    achievements: [
      "Developed Web3 applications with blockchain integration",
      "Implemented CI/CD pipelines reducing deployment time",
      "Improved database efficiency by 35%",
    ],
    technologies: [
      "React",
      "Web3",
      "Solidity",
      "Node.js",
      "PostgreSQL",
      "Docker",
    ],
  },
  {
    id: "frifty",
    company: "Frifty",
    role: "Product Lead",
    location: "India",
    startDate: "Jan 2023",
    endDate: "May 2024",
    description: "Led product development and managed a team of 5 developers.",
    achievements: [
      "Led team of 5 developers in product development",
      "Created UI library with 50+ reusable elements",
      "Established design system and component architecture",
    ],
    technologies: ["React", "TypeScript", "Figma", "Node.js", "MongoDB"],
  },
  {
    id: "aarna",
    company: "Aarna",
    role: "Product Developer",
    location: "India",
    startDate: "Jun 2022",
    endDate: "Dec 2022",
    description:
      "Developed MilkyMoo mobile application with payment integrations.",
    achievements: [
      "Built MilkyMoo mobile application",
      "Integrated 3 payment gateways (Razorpay, PayTM, UPI)",
      "Implemented real-time order tracking",
    ],
    technologies: ["Flutter", "Dart", "Firebase", "Node.js", "MongoDB"],
  },
  {
    id: "milk-mantra",
    company: "Milk Mantra",
    role: "Software Development Intern",
    location: "India",
    startDate: "Jan 2022",
    endDate: "May 2022",
    description:
      "Developed crypto portfolio tracker and implemented security features.",
    achievements: [
      "Built crypto portfolio tracking dashboard",
      "Implemented caching strategies for improved performance",
      "Added MFA authentication system",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Redis", "Web3"],
  },
];

export const projects: Project[] = [
  {
    id: "animepahe-dl-desktop",
    title: "Animepahe DL Desktop",
    description:
      "Cross-platform desktop app for anime streaming with batch download capabilities and seamless playback",
    longDescription: `Built with Tauri for a lightweight native experience. Features multi-threaded downloads,
    automatic episode tracking, and a clean terminal-inspired interface. Solves the frustration of managing
    anime downloads across fragmented sources.`,
    technologies: ["React", "Tauri", "Rust", "Tailwind CSS", "shadcn/ui"],
    category: "frontend",
    featured: true,
    githubUrl: "https://github.com/StrangeNoob/animepahe-dl-desktop",
    metrics: ["Cross-platform", "Batch downloads", "<50MB bundle"],
  },
  {
    id: "flight-price-api",
    title: "Flight Price API",
    description:
      "RESTful API for real-time flight price tracking with intelligent caching and rate limit handling",
    longDescription: `Aggregates flight data from Amadeus API with Redis caching to minimize API calls.
    Implements smart retry logic, request queuing, and automatic cache invalidation. Features Swagger UI
    documentation and Docker containerization for easy deployment.`,
    technologies: [
      "Python",
      "Django",
      "Redis",
      "Amadeus API",
      "Swagger",
      "Docker",
    ],
    category: "backend",
    featured: true,
    githubUrl: "https://github.com/StrangeNoob/flight-price-api",
    metrics: ["90% cache hit", "Rate limit safe", "Swagger docs"],
  },
  {
    id: "smart-search-tmdb",
    title: "Smart Search TMDB",
    description:
      "Intelligent movie discovery app with fuzzy search, filters, and personalized recommendations",
    longDescription: `A fast, responsive movie search experience powered by TMDb API. Features debounced search,
    infinite scroll, genre filtering, and a watchlist system with local persistence. Built with progressive
    enhancement for graceful degradation.`,
    technologies: ["TypeScript", "React", "Vite", "TMDb API", "Tailwind CSS"],
    category: "frontend",
    featured: true,
    liveUrl: "https://smart-search-tmdb.vercel.app",
    githubUrl: "https://github.com/StrangeNoob/smart-search-tmdb",
    metrics: ["Fuzzy search", "Infinite scroll", "Local persistence"],
  },
  {
    id: "storeopedia",
    title: "Storeopedia",
    description:
      "Android app for discovering and reviewing local stores with real-time location tracking",
    longDescription: `Built with Kotlin and Firebase stack. Features secure authentication, real-time store
    updates, image uploads with compression, and Google Maps integration for store discovery. Implements
    offline-first architecture with Firestore sync.`,
    technologies: [
      "Kotlin",
      "Firebase Auth",
      "Firestore",
      "Firebase Storage",
      "Google Maps API",
    ],
    category: "mobile",
    featured: true,
    githubUrl: "https://github.com/StrangeNoob/storeopedia",
    metrics: ["Offline-first", "Real-time sync", "Image compression"],
  },
];

export const skills: Skill[] = [
  // Frontend
  { name: "React", category: "frontend", proficiency: 95 },
  { name: "Next.js", category: "frontend", proficiency: 90 },
  { name: "TypeScript", category: "frontend", proficiency: 90 },
  { name: "Tailwind CSS", category: "frontend", proficiency: 95 },
  { name: "Framer Motion", category: "frontend", proficiency: 85 },

  // Backend
  { name: "Node.js", category: "backend", proficiency: 90 },
  { name: "Python", category: "backend", proficiency: 85 },
  { name: "FastAPI", category: "backend", proficiency: 80 },
  { name: "Express", category: "backend", proficiency: 90 },
  { name: "GraphQL", category: "backend", proficiency: 75 },

  // Mobile
  { name: "Flutter", category: "mobile", proficiency: 85 },
  { name: "React Native", category: "mobile", proficiency: 75 },

  // Cloud
  { name: "AWS", category: "cloud", proficiency: 80 },
  { name: "GCP", category: "cloud", proficiency: 85 },
  { name: "Docker", category: "cloud", proficiency: 80 },

  // Database
  { name: "PostgreSQL", category: "database", proficiency: 90 },
  { name: "MongoDB", category: "database", proficiency: 85 },
  { name: "Redis", category: "database", proficiency: 80 },
  { name: "Firebase", category: "database", proficiency: 85 },

  // AI/ML
  { name: "OpenAI API", category: "ai", proficiency: 85 },
  { name: "RAG Systems", category: "ai", proficiency: 80 },

  // Tools
  { name: "Git", category: "tools", proficiency: 95 },
  { name: "CI/CD", category: "tools", proficiency: 85 },
  { name: "Figma", category: "tools", proficiency: 75 },
];

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/StrangeNoob",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/prateek-mohanty/",
    icon: "linkedin",
  },
  {
    name: "X",
    url: "https://x.com/prateekmohanty",
    icon: "x",
  },
  {
    name: "Email",
    url: "mailto:itsprateekmohanty@gmail.com",
    icon: "mail",
  },
];

export const navItems = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];
