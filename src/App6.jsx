import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

import { OrbitControls, Grid, useGLTF, Text } from "@react-three/drei";
import cha from '../src/assets/Character/Animated Woman.glb'
import * as THREE from 'three'

const CharacterInstance = ({ modelPath, position, label }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath); // Load the model and animations
  const clonedScene = scene.clone(); // Clone the model for each instance

  useEffect(() => {
    // Ensure animations are properly reset for each instance
    if (animations) {
      const mixer = new THREE.AnimationMixer(clonedScene);
      animations.forEach((clip) => mixer.clipAction(clip).play());
    }
  }, [clonedScene, animations]);

  return (
    <group ref={group} position={position}>
      <primitive object={clonedScene} scale={2} />
      <Text
        position={[0, 2.5, 0]} // Position the label above the character
        fontSize={0.5}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

const App = () => {
  const characterPath = cha; // Replace with the correct path
  const numberOfCharacters = 10;

  // Generate positions for 10 characters
  const generatePositions = () => {
    const positions = [];
    for (let i = 0; i < numberOfCharacters; i++) {
      positions.push([i * 3, 0, 0]); // Spaced apart on the x-axis
    }
    return positions;
  };

  const characterPositions = generatePositions();

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls />
        <Grid
          infiniteGrid
          cellSize={1}
          cellThickness={1}
          sectionSize={10}
          sectionThickness={2}
          fadeDistance={30}
          fadeStrength={1}
          position={[0, 0, 0]}
        />
        {characterPositions.map((position, index) => (
          <CharacterInstance
            key={index}
            modelPath={characterPath}
            position={position}
            label={`Char ${index + 1}`}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default App;
