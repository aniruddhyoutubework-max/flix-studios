export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  stats?: string;
  color: string;
  accent: string;
  featured?: boolean;
}

export interface Capability {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  tagline: string;
  description: string;
}

export const SITE_CONFIG = {
  brand: {
    name: "FLIX STUDIOS",
    shortName: "FLIX",
    descriptor: "INDEPENDENT MINECRAFT SOFTWARE STUDIO",
    tagline: "FORWARD MOTION. DIGITAL WORLDS. CREATIVE FREEDOM.",
    heroHeadline: {
      line1: "WE DON'T JUST CREATE.",
      line2: "WE MOVE WORLDS."
    },
    heroSubtext: "Flix Studios is an independent Minecraft software studio engineering custom plugins, bespoke mods, and high-performance server architecture.",
    visualBreakStatement: "IDEAS IN MOTION. EXPERIENCES WITHOUT LIMITS.",
    studioPhilosophy: "WE BELIEVE THE INTERNET SHOULD BE FELT, NOT JUST VIEWED.",
    contactHeadline: "GOT AN IDEA THAT SHOULDN'T EXIST YET?",
    contactSubline: "Let's build the unexpected."
  },
  contact: {
    // Easily configurable studio email address:
    email: "collaborate@flixstudios.com",
    placeholderEmailNotice: "Editable in src/config/site.ts",
    location: "Global / Remote Explorations",
    availability: "Available for Q4/Q1 Select Commissions"
  },
  navigation: [
    { label: "Work", href: "#work" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Studio", href: "#studio" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" }
  ],
  projects: [
    {
      id: "nexus",
      title: "NEXUS",
      subtitle: "DIGITAL WORLDS",
      category: "Spatial Environment / WebGL",
      year: "2026",
      description: "An immersive environment with dimensional forms, atmospheric lighting, and spatial motion, challenging the boundaries of real-time browser performance.",
      stats: "60 FPS Interactive WebGL",
      color: "#0D1117",
      accent: "#8B5CFF",
      featured: true
    },
    {
      id: "afterglow",
      title: "AFTERGLOW",
      subtitle: "MOTION STUDY",
      category: "Kinetic Direction / Typography",
      year: "2026",
      description: "A kinetic visual experiment involving expressive typography, trails of light, and dynamic composition synchronized to spatial scroll physics.",
      stats: "Dynamic Particle Physics",
      color: "#141118",
      accent: "#D7FF3F",
      featured: false
    },
    {
      id: "flux",
      title: "FLUX",
      subtitle: "INTERACTIVE SYSTEMS",
      category: "Experimental UI / Generative",
      year: "2026",
      description: "A responsive, abstract interface exploring the relationship between movement and digital interaction through reactive mathematical vector fields.",
      stats: "Real-time Vector Field",
      color: "#0A131C",
      accent: "#38BDF8",
      featured: false
    },
    {
      id: "beyond-form",
      title: "BEYOND FORM",
      subtitle: "VISUAL EXPERIMENT",
      category: "Geometric Transformation",
      year: "2026",
      description: "A bold exploration of geometry, depth, contrast, and transformation inspired by the forward acceleration and layered planes of the FlixCore mark.",
      stats: "Procedural Subdivision",
      color: "#161214",
      accent: "#F43F5E",
      featured: false
    }
  ] as Project[],
  capabilities: [
    {
      id: "creative-dev",
      number: "01",
      title: "Creative Development",
      description: "Pushing web technology into uncharted territory through custom shaders, WebGL environments, canvas mechanics, and low-latency frontend architecture.",
      tags: ["WebGL / Three.js", "Custom GLSL", "Creative Code", "Performance Optimization"]
    },
    {
      id: "motion-design",
      number: "02",
      title: "Motion & Visual Design",
      description: "Crafting tactile, cinematic motion languages where every transition carries kinetic weight, narrative intention, and spatial choreography.",
      tags: ["Kinetic Systems", "Micro-interactions", "Choreography", "Visual Direction"]
    },
    {
      id: "web-experiences",
      number: "03",
      title: "Web Experiences",
      description: "Designing uncompromising digital flags that capture cultural momentum, establish category leadership, and turn passive visitors into mesmerized audiences.",
      tags: ["Editorial Layouts", "Interactive Worlds", "Brand Flagships", "Responsive Architecture"]
    },
    {
      id: "digital-experiments",
      number: "04",
      title: "Digital Experiments",
      description: "Laboratory explorations in generative geometry, directional physics, audio-visual synthesis, and emergent browser capabilities.",
      tags: ["Rapid Prototyping", "Generative Systems", "Spatial UI", "R&D"]
    }
  ] as Capability[],
  process: [
    {
      number: "01",
      title: "DISCOVER",
      tagline: "Uncover the creative nucleus",
      description: "We interrogate the objective, audience, and creative opportunity to identify what will make this experience fundamentally unforgettable."
    },
    {
      number: "02",
      title: "EXPLORE",
      tagline: "Formulate the visual language",
      description: "Developing rapid interactive concepts, motion studies, typographic hierarchies, and spatial directions without generic templates."
    },
    {
      number: "03",
      title: "BUILD",
      tagline: "Engineer the digital world",
      description: "Transforming the selected direction into high-performance, responsive code with meticulous attention to framerates and tactile responsiveness."
    },
    {
      number: "04",
      title: "REFINE",
      tagline: "Obsess over the final 5%",
      description: "Polishing micro-interactions, tuning easing curves, verifying cross-device behavior, and ensuring seamless accessibility."
    }
  ] as ProcessStep[],
  socials: [
    { name: "X / Twitter", url: "https://x.com", placeholder: true },
    { name: "Instagram", url: "https://instagram.com", placeholder: true },
    { name: "GitHub", url: "https://github.com", placeholder: true },
    { name: "LinkedIn", url: "https://linkedin.com", placeholder: true }
  ]
};
