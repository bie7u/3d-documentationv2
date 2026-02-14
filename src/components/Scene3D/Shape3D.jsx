import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Shape3D = ({ step, isActive }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (isActive && meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const getGeometry = (size) => {
    switch (step.shapeType) {
      case 'cube':
        return new THREE.BoxGeometry(size, size, size);
      case 'cylinder':
        return new THREE.CylinderGeometry(size * 0.5, size * 0.5, size * 1.5, 32);
      case 'sphere':
        return new THREE.SphereGeometry(size * 0.7, 32, 32);
      case 'cone':
        return new THREE.ConeGeometry(size * 0.7, size * 1.5, 32);
      default:
        return new THREE.BoxGeometry(size, size, size);
    }
  };

  const edgesGeometry = useMemo(() => {
    const size = step.size || 1;
    const geometry = getGeometry(size * 1.05);
    return new THREE.EdgesGeometry(geometry);
  }, [step.shapeType, step.size]);

  const renderShape = () => {
    const size = step.size || 1;
    
    switch (step.shapeType) {
      case 'cube':
        return <boxGeometry args={[size, size, size]} />;
      case 'cylinder':
        return <cylinderGeometry args={[size * 0.5, size * 0.5, size * 1.5, 32]} />;
      case 'sphere':
        return <sphereGeometry args={[size * 0.7, 32, 32]} />;
      case 'cone':
        return <coneGeometry args={[size * 0.7, size * 1.5, 32]} />;
      default:
        return <boxGeometry args={[size, size, size]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={step.position}
      castShadow
      receiveShadow
    >
      {renderShape()}
      <meshStandardMaterial
        color={step.color}
        metalness={0.3}
        roughness={0.4}
        emissive={isActive ? step.color : '#000000'}
        emissiveIntensity={isActive ? 0.3 : 0}
      />
      {isActive && (
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial color="#ffffff" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
};

export default Shape3D;
