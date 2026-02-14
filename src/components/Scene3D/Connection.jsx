import React, { useMemo } from 'react';
import * as THREE from 'three';

const Connection = ({ from, to }) => {
  const points = useMemo(() => {
    return [
      new THREE.Vector3(...from),
      new THREE.Vector3(...to),
    ];
  }, [from, to]);

  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#ffff00" linewidth={2} />
    </line>
  );
};

export default Connection;
