import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Component for rendering a single 3D shape
 * Supports: cube, sphere, cylinder, cone
 * 
 * Props:
 * - step: step object containing shape type, position, color
 * - isSelected: whether this step is currently selected
 * - onClick: callback when the shape is clicked
 */
function Shape3D({ step, isSelected, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Animate selected shapes with a subtle rotation
  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  // Determine which geometry to use based on shape type
  const renderGeometry = () => {
    switch (step.shape) {
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.6, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case 'cone':
        return <coneGeometry args={[0.6, 1, 32]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={step.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {renderGeometry()}
      <meshStandardMaterial
        color={step.color}
        emissive={isSelected ? step.color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
        opacity={hovered ? 0.8 : 1}
        transparent={hovered}
      />
      {/* Wireframe overlay when selected */}
      {isSelected && (
        <mesh>
          {renderGeometry()}
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      )}
    </mesh>
  );
}

export default Shape3D;
