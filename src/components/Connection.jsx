import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Component for rendering a connection (line/pipe) between two steps
 * Creates a cylindrical pipe connecting the center of two 3D objects
 * 
 * Props:
 * - start: [x, y, z] position of the starting point
 * - end: [x, y, z] position of the ending point
 */
function Connection({ start, end }) {
  // Calculate the geometry for the pipe connection
  const { position, rotation, length } = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    // Calculate the midpoint between start and end
    const midpoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
    
    // Calculate the direction and distance
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const length = direction.length();
    
    // Calculate rotation to align the cylinder with the connection line
    const axis = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      axis,
      direction.clone().normalize()
    );
    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    
    return {
      position: [midpoint.x, midpoint.y, midpoint.z],
      rotation: [euler.x, euler.y, euler.z],
      length,
    };
  }, [start, end]);

  return (
    <mesh position={position} rotation={rotation}>
      {/* Cylindrical pipe with small radius */}
      <cylinderGeometry args={[0.05, 0.05, length, 8]} />
      <meshStandardMaterial
        color="#888888"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export default Connection;
