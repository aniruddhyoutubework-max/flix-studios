import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, X, Maximize2, Layers, Cpu, Eye } from 'lucide-react';
import { SITE_CONFIG, Project } from '../config/site';

export const SelectedWork: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="work" className="relative py-28 sm:py-36 px-6 sm:px-10 lg:px-16 bg-[#08090B]">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-16 sm:mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#D7FF3F] tracking-[0.25em] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF3F]" />
              <span>EXPERIMENT ARCHIVE</span>
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase text-[#F4F3EE]">
              SELECTED EXPERIMENTS
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[#9FA2AD] font-normal leading-relaxed">
            A collection of visual explorations, digital concepts, and creative directions pushing the boundaries of interactive space.
          </p>
        </div>
      </div>

      {/* Projects Grid — Asymmetric Editorial Layout */}
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {SITE_CONFIG.projects.map((project, index) => {
          const isFeatured = project.featured;

          return (
            <article
              key={project.id}
              className={`group relative rounded-3xl overflow-hidden border border-white/10 bg-[#111216] transition-all duration-500 hover:border-white/25 hover:shadow-2xl ${
                isFeatured ? 'p-6 sm:p-10 lg:p-14' : 'p-6 sm:p-8'
              }`}
            >
              <div className={`grid gap-8 lg:gap-12 items-center ${
                isFeatured ? 'lg:grid-cols-12' : index % 2 === 0 ? 'lg:grid-cols-12' : 'lg:grid-cols-12'
              }`}>
                {/* Artwork Viewport */}
                <div className={`relative rounded-2xl overflow-hidden bg-[#0A0B0E] border border-white/5 aspect-[16/10] ${
                  isFeatured ? 'lg:col-span-7' : 'lg:col-span-7'
                }`}>
                  {/* Procedural Visual Rendering for each project */}
                  {project.id === 'nexus' && <NexusVisual />}
                  {project.id === 'afterglow' && <AfterglowVisual />}
                  {project.id === 'flux' && <FluxVisual />}
                  {project.id === 'beyond-form' && <BeyondFormVisual />}

                  {/* Corner Badge */}
                  <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-[#F4F3EE]">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.accent }} />
                    <span>{project.stats}</span>
                  </div>

                  {/* Expand button for modal */}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="absolute bottom-4 right-4 z-10 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:scale-110 transition-transform"
                    aria-label={`View full details of ${project.title}`}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Project Metadata & Narrative */}
                <div className={`flex flex-col justify-center ${
                  isFeatured ? 'lg:col-span-5' : 'lg:col-span-5'
                }`}>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#9FA2AD] mb-3">
                    <span className="text-[#D7FF3F]">0{index + 1}</span>
                    <span>/</span>
                    <span className="uppercase">{project.category}</span>
                    <span>/</span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight uppercase text-[#F4F3EE] group-hover:text-gradient-lime transition-colors">
                    {project.title}
                  </h3>
                  <div className="text-sm font-mono tracking-widest text-[#9FA2AD] uppercase mt-1 mb-4">
                    {project.subtitle}
                  </div>

                  <p className="text-[#9FA2AD] text-sm sm:text-base leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#F4F3EE] hover:text-[#D7FF3F] transition-colors"
                    >
                      <span>INSPECT EXPERIMENT</span>
                      <ArrowUpRight className="w-4 h-4 text-[#D7FF3F]" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
        >
          <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#111216] p-6 sm:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#D7FF3F] tracking-widest uppercase mb-4">
              <span>{selectedProject.category}</span>
              <span>•</span>
              <span>CONCEPT STUDY</span>
            </div>

            <h3 className="font-display font-bold text-3xl sm:text-5xl uppercase text-[#F4F3EE]">
              {selectedProject.title} — {selectedProject.subtitle}
            </h3>

            <div className="my-6 rounded-2xl overflow-hidden border border-white/10 aspect-[16/9] relative bg-[#08090B]">
              {selectedProject.id === 'nexus' && <NexusVisual />}
              {selectedProject.id === 'afterglow' && <AfterglowVisual />}
              {selectedProject.id === 'flux' && <FluxVisual />}
              {selectedProject.id === 'beyond-form' && <BeyondFormVisual />}
            </div>

            <div className="space-y-4 text-[#9FA2AD] text-sm sm:text-base leading-relaxed">
              <p>{selectedProject.description}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
                <div>
                  <span className="text-[#5E6270] block">RENDER PIPELINE</span>
                  <span className="text-[#F4F3EE]">{selectedProject.stats}</span>
                </div>
                <div>
                  <span className="text-[#5E6270] block">CREATIVE DIRECTIVE</span>
                  <span className="text-[#D7FF3F]">Autonomous Studio R&D</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/* --- Procedural Art Components --- */

const NexusVisual: React.FC = () => (
  <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0D1117] to-[#08090B]">
    <div className="absolute inset-0 bg-grid-pattern opacity-40" />
    <div className="absolute w-72 h-72 rounded-full bg-[#8B5CFF]/25 blur-3xl" />
    {/* Concentric rotating geometric isometric portals */}
    <div className="relative flex items-center justify-center">
      {[1, 2, 3, 4].map((ring) => (
        <div
          key={ring}
          className="absolute border border-[#8B5CFF]/30 rounded-2xl transition-transform duration-1000 group-hover:scale-110"
          style={{
            width: `${ring * 65}px`,
            height: `${ring * 65}px`,
            transform: `rotate(${ring * 22}deg)`,
            borderColor: ring === 2 ? '#D7FF3F' : undefined,
            opacity: 1 - ring * 0.15
          }}
        />
      ))}
      <div className="relative z-10 w-16 h-16 rounded-full bg-[#8B5CFF]/40 backdrop-blur-md flex items-center justify-center border border-[#8B5CFF] shadow-[0_0_30px_#8B5CFF]">
        <Layers className="w-7 h-7 text-white" />
      </div>
    </div>
  </div>
);

const AfterglowVisual: React.FC = () => (
  <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-[#141118]">
    <div className="absolute inset-0 bg-[radial-gradient(#D7FF3F_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
    <div className="absolute w-80 h-40 bg-gradient-to-r from-[#D7FF3F]/30 to-[#8B5CFF]/30 blur-2xl transform -rotate-12" />
    {/* Directional Light Trails */}
    <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 250">
      <defs>
        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D7FF3F" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8B5CFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M 50 200 Q 200 40 350 180" stroke="url(#glowGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M 30 180 Q 180 20 370 200" stroke="#D7FF3F" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.7" />
      <circle cx="200" cy="110" r="8" fill="#D7FF3F" filter="drop-shadow(0 0 10px #D7FF3F)" />
      <circle cx="350" cy="180" r="5" fill="#8B5CFF" />
    </svg>
    <div className="relative z-10 font-mono text-xs tracking-widest text-[#D7FF3F] bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
      KINETIC PHOTON TRAJECTORY
    </div>
  </div>
);

const FluxVisual: React.FC = () => (
  <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-[#0A131C]">
    <div className="absolute inset-0 flex items-center justify-center opacity-30">
      <div className="w-96 h-96 border border-[#38BDF8]/40 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
    </div>
    {/* Reactive Vector Grid */}
    <div className="grid grid-cols-6 gap-6 opacity-60">
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="w-4 h-4 rounded-full border border-[#38BDF8]/60 flex items-center justify-center text-[8px] text-[#38BDF8] transition-transform duration-300 group-hover:rotate-45"
        >
          →
        </div>
      ))}
    </div>
    <div className="absolute bottom-4 left-4 font-mono text-[10px] text-[#38BDF8] tracking-widest">
      VECTOR OSCILLATION • MODE β
    </div>
  </div>
);

const BeyondFormVisual: React.FC = () => (
  <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-[#161214]">
    <div className="absolute w-64 h-64 bg-[#F43F5E]/20 rounded-full blur-3xl" />
    {/* Angular geometric polygons */}
    <svg className="w-56 h-56 transform transition-transform duration-700 group-hover:rotate-180" viewBox="0 0 200 200">
      <polygon points="100,20 180,60 160,160 40,160 20,60" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 4" />
      <polygon points="100,50 150,80 130,140 70,140 50,80" fill="rgba(244, 63, 94, 0.15)" stroke="#F43F5E" strokeWidth="2" />
      <line x1="100" y1="20" x2="100" y2="50" stroke="#F43F5E" strokeWidth="1.5" />
      <line x1="180" y1="60" x2="150" y2="80" stroke="#F43F5E" strokeWidth="1.5" />
      <line x1="160" y1="160" x2="130" y2="140" stroke="#F43F5E" strokeWidth="1.5" />
      <line x1="40" y1="160" x2="70" y2="140" stroke="#F43F5E" strokeWidth="1.5" />
      <line x1="20" y1="60" x2="50" y2="80" stroke="#F43F5E" strokeWidth="1.5" />
    </svg>
    <div className="absolute z-10 font-mono text-[10px] text-white/80 bg-black/60 px-3 py-1 rounded-full border border-white/10">
      PROCEDURAL SUBDIVISION
    </div>
  </div>
);
