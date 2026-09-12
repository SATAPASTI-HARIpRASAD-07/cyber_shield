import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CyberShield3DProps {
  mode?: 'shield' | 'network';
  height?: string;
}

export const CyberShield3D: React.FC<CyberShield3DProps> = ({ mode = 'shield', height = '320px' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 300;
    const h = container.clientHeight || 320;

    // 1. Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / h, 0.1, 1000);
    camera.position.z = mode === 'network' ? 12 : 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    if (mode === 'shield') {
      // Create 3D Icosahedron Shield Geometry
      const geometry = new THREE.IcosahedronGeometry(2.2, 2);
      const material = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      const shieldMesh = new THREE.Mesh(geometry, material);
      mainGroup.add(shieldMesh);

      // Inner Core Sphere
      const coreGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      mainGroup.add(coreMesh);

      // Outer Ring
      const ringGeo = new THREE.TorusGeometry(3.2, 0.04, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      mainGroup.add(ringMesh);
    } else {
      // 3D Fraud Twin Attack Graph Nodes (OTP -> CALL -> MESSAGE -> URL -> WEBSITE)
      const nodePositions = [
        new THREE.Vector3(-4, 2, 0),   // OTP
        new THREE.Vector3(-2, -1, 0),  // CALL
        new THREE.Vector3(0, 2.2, 0),   // MESSAGE
        new THREE.Vector3(2.5, -0.5, 0),// URL
        new THREE.Vector3(4.5, 1.8, 0)  // WEBSITE
      ];

      const nodeColors = [0xa855f7, 0xf59e0b, 0xef4444, 0xef4444, 0xef4444];

      nodePositions.forEach((pos, idx) => {
        const sphereGeo = new THREE.SphereGeometry(0.55, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: nodeColors[idx],
          wireframe: true,
        });
        const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
        nodeMesh.position.copy(pos);
        mainGroup.add(nodeMesh);
      });

      // Connect Nodes with Glowing Line
      const points = nodePositions;
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      mainGroup.add(lineMesh);
    }

    // Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      mainGroup.rotation.y += 0.008;
      mainGroup.rotation.x += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl flex items-center justify-center bg-cyber-panel/40 border border-cyber-border/40">
      <div ref={mountRef} style={{ width: '100%', height }} className="cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-2 right-3 text-[10px] text-sky-400/60 font-mono">
        Three.js 3D Engine • Active
      </div>
    </div>
  );
};
