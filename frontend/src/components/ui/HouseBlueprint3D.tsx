import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Grid, Box } from '@react-three/drei';
import * as THREE from 'three';

export interface ApplianceData {
  id: string;
  name: string;
  isActive: boolean;
  position: [number, number, number]; // [x, y, z]
  color?: string;
}

interface HouseBlueprint3DProps {
  appliances: ApplianceData[];
  propertyId?: number;
}

// A glowing, pulsating marker for appliances
const ApplianceMarker: React.FC<{ appliance: ApplianceData }> = ({ appliance }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && appliance.isActive) {
      // Pulsate scale slightly when active
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  const baseColor = appliance.isActive ? (appliance.color || '#10b981') : '#94a3b8'; // Emerald vs Slate

  return (
    <group position={appliance.position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={baseColor} 
          emissive={baseColor} 
          emissiveIntensity={appliance.isActive ? 0.8 : 0.1} 
          toneMapped={false} 
        />
      </mesh>
      
      {/* HTML Label floating above the marker */}
      <Html position={[0, 0.8, 0]} center zIndexRange={[100, 0]}>
        <div className={`px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-colors duration-300 ${appliance.isActive ? 'bg-emerald-500 text-white shadow-[0_0_10px_#10b981]' : 'bg-slate-200 text-slate-500 border border-slate-300'}`}>
          {appliance.name}
        </div>
      </Html>
    </group>
  );
};

// Abstract House Walls
const BlueprintWalls: React.FC<{ propertyId?: number }> = ({ propertyId = 1 }) => {
  const wallMaterial = <meshStandardMaterial color="#cbd5e1" transparent opacity={0.3} roughness={0.1} />;
  
  if (propertyId === 2) {
    // Guest House (smaller, simpler)
    return (
      <group>
        <Box args={[8, 1.5, 0.2]} position={[0, 0.75, -4]}>{wallMaterial}</Box>
        <Box args={[8, 1.5, 0.2]} position={[0, 0.75, 4]}>{wallMaterial}</Box>
        <Box args={[0.2, 1.5, 8]} position={[-4, 0.75, 0]}>{wallMaterial}</Box>
        <Box args={[0.2, 1.5, 8]} position={[4, 0.75, 0]}>{wallMaterial}</Box>
        
        <Box args={[4, 1.5, 0.2]} position={[-2, 0.75, 0]}>{wallMaterial}</Box>

        <Html position={[-2, 0.1, -2]} center rotation={[-Math.PI/2, 0, 0]}>
          <div className="text-slate-400 font-extrabold text-sm opacity-50 select-none uppercase tracking-widest">Main Room</div>
        </Html>
        <Html position={[2, 0.1, 0]} center rotation={[-Math.PI/2, 0, 0]}>
          <div className="text-slate-400 font-extrabold text-sm opacity-50 select-none uppercase tracking-widest">Studio / Bed</div>
        </Html>
      </group>
    );
  } else if (propertyId === 3) {
    // Mountain Cabin (L-shaped or different layout)
    return (
      <group>
        <Box args={[12, 1.5, 0.2]} position={[0, 0.75, -4]}>{wallMaterial}</Box>
        <Box args={[12, 1.5, 0.2]} position={[0, 0.75, 4]}>{wallMaterial}</Box>
        <Box args={[0.2, 1.5, 8]} position={[-6, 0.75, 0]}>{wallMaterial}</Box>
        <Box args={[0.2, 1.5, 8]} position={[6, 0.75, 0]}>{wallMaterial}</Box>
        
        {/* Split down the middle */}
        <Box args={[0.2, 1.5, 8]} position={[0, 0.75, 0]}>{wallMaterial}</Box>

        <Html position={[-3, 0.1, 0]} center rotation={[-Math.PI/2, 0, 0]}>
          <div className="text-slate-400 font-extrabold text-sm opacity-50 select-none uppercase tracking-widest">Great Room</div>
        </Html>
        <Html position={[3, 0.1, 0]} center rotation={[-Math.PI/2, 0, 0]}>
          <div className="text-slate-400 font-extrabold text-sm opacity-50 select-none uppercase tracking-widest">Bunk Area</div>
        </Html>
      </group>
    );
  }

  // Default: Main Residence (propertyId 1)
  return (
    <group>
      {/* Outer Walls */}
      <Box args={[10, 1.5, 0.2]} position={[0, 0.75, -5]}>{wallMaterial}</Box>
      <Box args={[10, 1.5, 0.2]} position={[0, 0.75, 5]}>{wallMaterial}</Box>
      <Box args={[0.2, 1.5, 10]} position={[-5, 0.75, 0]}>{wallMaterial}</Box>
      <Box args={[0.2, 1.5, 10]} position={[5, 0.75, 0]}>{wallMaterial}</Box>

      {/* Inner Dividing Walls (creating rooms) */}
      <Box args={[5, 1.5, 0.2]} position={[-2.5, 0.75, 0]}>{wallMaterial}</Box>
      <Box args={[0.2, 1.5, 5]} position={[0, 0.75, 2.5]}>{wallMaterial}</Box>
      
      {/* Room Labels (rendered on the floor) */}
      <Html position={[-2.5, 0.1, -2.5]} center rotation={[-Math.PI/2, 0, 0]}>
        <div className="text-slate-400 font-extrabold text-sm opacity-50 select-none uppercase tracking-widest">Living Area</div>
      </Html>
      <Html position={[2.5, 0.1, -2.5]} center rotation={[-Math.PI/2, 0, 0]}>
        <div className="text-slate-400 font-extrabold text-sm opacity-50 select-none uppercase tracking-widest">Kitchen</div>
      </Html>
      <Html position={[-2.5, 0.1, 2.5]} center rotation={[-Math.PI/2, 0, 0]}>
        <div className="text-slate-400 font-extrabold text-sm opacity-50 select-none uppercase tracking-widest">Bedroom</div>
      </Html>
      <Html position={[2.5, 0.1, 2.5]} center rotation={[-Math.PI/2, 0, 0]}>
        <div className="text-slate-400 font-extrabold text-sm opacity-50 select-none uppercase tracking-widest">Utility / Garage</div>
      </Html>
    </group>
  );
};

export const HouseBlueprint3D: React.FC<HouseBlueprint3DProps> = ({ appliances, propertyId = 1 }) => {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-[#f1f5f9] relative shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#ffffff]">
      <Canvas camera={{ position: [8, 8, 8], fov: 45 }}>
        {/* Soft studio-like lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <group position={[0, -0.5, 0]}> {/* Shift down slightly to center vertically */}
          {/* Blueprint Grid Floor */}
          <Grid 
            renderOrder={-1} 
            position={[0, 0, 0]} 
            infiniteGrid 
            fadeDistance={20} 
            fadeStrength={5} 
            cellSize={1} 
            sectionSize={5} 
            cellColor="#cbd5e1" 
            sectionColor="#94a3b8" 
          />
          
          <BlueprintWalls propertyId={propertyId} />

          {/* Render Appliances */}
          {appliances.map(app => (
            <ApplianceMarker key={app.id} appliance={app} />
          ))}
        </group>

        {/* Controls: restrict angle to keep it looking like a blueprint (no going under the floor) */}
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2 - 0.1} 
          minDistance={5} 
          maxDistance={25} 
        />
      </Canvas>
      
      {/* HUD overlay */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-600">3D Blueprint Live</span>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-white/60 px-2 py-1 rounded">Drag to Rotate</span>
      </div>
    </div>
  );
};

export default HouseBlueprint3D;
