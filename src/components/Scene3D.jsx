import { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import useStore from '../store/useStore';
import Shape3D from './Shape3D';
import Connection from './Connection';
import * as THREE from 'three';

/**
 * Camera controller that focuses on the active step
 */
function CameraController({ targetPosition, viewerMode }) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const targetRef = useRef(new THREE.Vector3());
  const cameraTargetRef = useRef(new THREE.Vector3());
  
  useEffect(() => {
    if (viewerMode && targetPosition) {
      // Set target position for smooth transition
      targetRef.current.set(...targetPosition);
      
      // Calculate camera position: offset from target
      const offset = new THREE.Vector3(5, 5, 5);
      cameraTargetRef.current.copy(targetRef.current).add(offset);
    }
  }, [targetPosition, viewerMode]);
  
  useFrame(() => {
    if (viewerMode && targetPosition && controlsRef.current) {
      // Smoothly move camera to target position
      camera.position.lerp(cameraTargetRef.current, 0.05);
      
      // Smoothly move controls target to shape position
      controlsRef.current.target.lerp(targetRef.current, 0.05);
      controlsRef.current.update();
    }
  });
  
  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={5}
      maxDistance={50}
    />
  );
}

/**
 * Main 3D Scene component
 * Renders all steps as 3D shapes and connections between them
 * Uses React Three Fiber for declarative 3D rendering
 */
function Scene3D() {
  const steps = useStore((state) => state.steps);
  const selectedStepId = useStore((state) => state.selectedStepId);
  const selectStep = useStore((state) => state.selectStep);
  const viewerMode = useStore((state) => state.viewerMode);
  
  // Find the selected step to get its position (could be a step or substep)
  let targetPosition = null;
  const selectedStep = steps.find((step) => step.id === selectedStepId);
  if (selectedStep) {
    targetPosition = selectedStep.position;
  } else {
    // Search in substeps
    for (const step of steps) {
      if (step.subSteps && step.subSteps.length > 0) {
        const foundSubStep = step.subSteps.find((subStep) => subStep.id === selectedStepId);
        if (foundSubStep) {
          targetPosition = foundSubStep.position;
          break;
        }
      }
    }
  }

  // Flatten all steps and substeps for rendering
  const allShapes = [];
  const allConnections = [];

  steps.forEach((step, index) => {
    // Add main step
    allShapes.push(
      <Shape3D
        key={step.id}
        step={step}
        isSelected={step.id === selectedStepId}
        onClick={() => selectStep(step.id)}
      />
    );

    // Add connection to previous step
    if (index > 0) {
      const previousStep = steps[index - 1];
      allConnections.push(
        <Connection
          key={`connection-${step.id}`}
          start={previousStep.position}
          end={step.position}
        />
      );
    }

    // Add substeps and their connections
    if (step.subSteps && step.subSteps.length > 0) {
      step.subSteps.forEach((subStep, subIndex) => {
        // Add substep shape
        allShapes.push(
          <Shape3D
            key={subStep.id}
            step={subStep}
            isSelected={subStep.id === selectedStepId}
            onClick={() => selectStep(subStep.id)}
          />
        );

        // Add connection from parent to first substep
        if (subIndex === 0) {
          allConnections.push(
            <Connection
              key={`connection-parent-${subStep.id}`}
              start={step.position}
              end={subStep.position}
            />
          );
        }

        // Add connection between consecutive substeps
        if (subIndex > 0) {
          const previousSubStep = step.subSteps[subIndex - 1];
          allConnections.push(
            <Connection
              key={`connection-substep-${subStep.id}`}
              start={previousSubStep.position}
              end={subStep.position}
            />
          );
        }
      });
    }
  });

  return (
    <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }}>
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
        {/* Lighting setup */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Grid helper for reference */}
        <Grid
          args={[30, 30]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#444444"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#666666"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />
        
        {/* Render all shapes (steps and substeps) */}
        {allShapes}
        
        {/* Render all connections */}
        {allConnections}
        
        {/* Camera controls - allows user to rotate, zoom, and pan */}
        <CameraController 
          targetPosition={targetPosition}
          viewerMode={viewerMode}
        />
      </Canvas>
    </div>
  );
}

export default Scene3D;
