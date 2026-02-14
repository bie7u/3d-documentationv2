import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import useStepsStore from '../../store/useStepsStore';
import Shape3D from './Shape3D';
import Connection from './Connection';
import './Scene3D.css';

const Scene3D = () => {
  const steps = useStepsStore((state) => state.steps);
  const activeStepId = useStepsStore((state) => state.activeStepId);

  return (
    <div className="scene-3d">
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{ background: '#1a1a2e' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1}
          position={[0, -0.01, 0]}
        />

        {steps.map((step) => (
          <Shape3D
            key={step.id}
            step={step}
            isActive={step.id === activeStepId}
          />
        ))}

        {steps.map((step) => {
          if (step.connections) {
            const connectedStep = steps.find((s) => s.id === step.connections);
            if (connectedStep) {
              return (
                <Connection
                  key={`connection-${step.id}`}
                  from={connectedStep.position}
                  to={step.position}
                />
              );
            }
          }
          return null;
        })}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
};

export default Scene3D;
