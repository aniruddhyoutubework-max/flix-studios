import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090B, 0.04);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.maxWidth = '100%';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x181A20, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xF4F3EE, 2.2);
    dirLight.position.set(5, 8, 6);
    scene.add(dirLight);

    const limePoint = new THREE.PointLight(0xD7FF3F, 3.5, 25);
    limePoint.position.set(-3, -2, 4);
    scene.add(limePoint);

    const violetPoint = new THREE.PointLight(0x8B5CFF, 4.0, 30);
    violetPoint.position.set(4, 3, 2);
    scene.add(violetPoint);

    // Group for directional forms
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Create custom chevron extruded shape inspired by forward geometry
    const createChevronShape = (scale = 1) => {
      const shape = new THREE.Shape();
      // Outer arrow pointing right
      const w = 1.8 * scale;
      const h = 2.2 * scale;
      const t = 0.55 * scale; // thickness

      shape.moveTo(-w * 0.4, h);
      shape.lineTo(w * 0.6, 0);
      shape.lineTo(-w * 0.4, -h);
      shape.lineTo(-w * 0.4 + t, -h);
      shape.lineTo(w * 0.6 + t, 0);
      shape.lineTo(-w * 0.4 + t, h);
      shape.closePath();

      return shape;
    };

    const extrudeSettings = {
      steps: 1,
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 3
    };

    // Obsidian metallic material
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x14161C,
      metalness: 0.85,
      roughness: 0.25,
      envMapIntensity: 1.0
    });

    // Glowing edge line material
    const limeLineMat = new THREE.LineBasicMaterial({
      color: 0xD7FF3F,
      transparent: true,
      opacity: 0.75,
      linewidth: 1
    });

    const violetLineMat = new THREE.LineBasicMaterial({
      color: 0x8B5CFF,
      transparent: true,
      opacity: 0.85,
      linewidth: 1
    });

    // Array of nested dimensional portals moving through depth
    const portals: { mesh: THREE.Mesh; line: THREE.LineSegments; speed: number; baseZ: number }[] = [];
    const portalCount = 6;

    for (let i = 0; i < portalCount; i++) {
      const scale = 1.0 + i * 0.35;
      const geom = new THREE.ExtrudeGeometry(createChevronShape(scale), {
        ...extrudeSettings,
        depth: 0.2 + i * 0.05
      });
      geom.center();

      const edgesGeom = new THREE.EdgesGeometry(geom, 25);
      const line = new THREE.LineSegments(
        edgesGeom,
        i % 2 === 0 ? limeLineMat : violetLineMat
      );

      const mesh = new THREE.Mesh(geom, darkMat);
      mesh.add(line);

      const z = -i * 2.8 + 2;
      mesh.position.set(0.5, 0, z);
      mesh.rotation.y = -0.15;
      mesh.rotation.x = 0.08;

      mainGroup.add(mesh);
      portals.push({ mesh, line, speed: 0.008 + i * 0.002, baseZ: z });
    }

    // Floating Particles Stream (Velocity stars / data dust)
    const particleCount = 700;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cLime = new THREE.Color(0xD7FF3F);
    const cViolet = new THREE.Color(0x8B5CFF);
    const cWhite = new THREE.Color(0xF4F3EE);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 24;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const pickColor = Math.random();
      const col = pickColor > 0.65 ? cLime : pickColor > 0.35 ? cViolet : cWhite;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x * 0.8;
      targetMouseY = y * 0.5;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Visibility Observer to pause when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Camera parallax
      camera.position.x = mouseX * 1.5;
      camera.position.y = mouseY * 1.2;
      camera.lookAt(0.5, 0, 0);

      // Rotate and pulse main group
      mainGroup.rotation.z = Math.sin(elapsedTime * 0.3) * 0.04;

      // Animate portals moving forward
      portals.forEach((p, idx) => {
        p.mesh.position.z += 0.012;
        p.mesh.rotation.z = Math.sin(elapsedTime * 0.5 + idx) * 0.03;

        // Reset if passed camera
        if (p.mesh.position.z > 6) {
          p.mesh.position.z = -12;
        }

        // Pulse light point
        if (idx === 0) {
          limePoint.position.x = p.mesh.position.x + Math.sin(elapsedTime) * 1.5;
          limePoint.position.y = p.mesh.position.y + Math.cos(elapsedTime) * 1.5;
        }
      });

      // Stream particles towards viewer
      const positions = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] += 0.04;
        if (positions[i * 3 + 2] > 10) {
          positions[i * 3 + 2] = -15;
          positions[i * 3] = (Math.random() - 0.5) * 24;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
        }
      }
      particleGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Fallback if WebGL is disabled or unsupported */}
      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#08090B]">
          <div className="relative w-96 h-96 opacity-40">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8B5CFF]/30 to-[#D7FF3F]/30 blur-3xl" />
            <img
              src="/flixcore-logo-white.png"
              alt=""
              className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(215,255,63,0.3)] animate-pulse"
            />
          </div>
        </div>
      )}
    </div>
  );
};
