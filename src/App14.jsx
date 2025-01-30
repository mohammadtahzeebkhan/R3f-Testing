import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF, Clone, useAnimations } from "@react-three/drei";
import C from "../src/assets/Character/Animated Woman.glb";
import { AmbientLight } from "three";
//const C = process.env.NEXT_PUBLIC_DUMMY || "/assets/Character/AnimatedWoman.glb";
import { predefinedPath } from "./path";
const ModelWithPath = ({ predefinedPath, replay }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(C);
  const { actions } = useAnimations(animations, group);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (replay) {
      setCurrentFrame(0); // Reset to the start of the path when replay begins
    }
  }, [replay]);

  useFrame(() => {
    if (replay && predefinedPath.length > 0) {
      const { position, rotation, animation } = predefinedPath[currentFrame];

      // Update position, rotation, and animation
      group.current.position.set(...position);
      group.current.rotation.set(...rotation);

      if (actions[animation]) {
        actions[animation].reset().fadeIn(0.2).play();
      }

      // Move to the next frame or loop back to Clonethe start
      setCurrentFrame((prev) => (prev + 1) % predefinedPath.length);
    }
  });

  return (
    <primitive ref={group} object={scene} scale={1.5} />
  );
};

const App = () => {
  const [isReplaying, setIsReplaying] = useState(true);



  const handleReplay = () => {
    setIsReplaying((prev) => !prev); // Toggle replay
  };

  return (
  <Canvas style={{height:"100vh"}}>
    <ambientLight intensity={5}/>
    <OrbitControls/>
    
        <ModelWithPath predefinedPath={predefinedPath} replay={isReplaying} />
        </Canvas>
     
  );
};

export default App;
