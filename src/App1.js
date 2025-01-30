 import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from 'three';
import Character from "../src/assets/Character/Animated Woman.glb";
import City from '../src/assets/Hall/park_scene.glb'

import { predefinedPath } from "./path";
const Box = ({ predefinedPath, replay }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(Character); // Load the GLTF model
  const { actions } = useAnimations(animations, group); // Handle animations
  const { scene: cityScene } = useGLTF(City);
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]); // Store rotation as Euler angles
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  useFrame(() => {
    if (replay) {
      const replayIndex = replay.current;
      if (replayIndex < predefinedPath.length) {
        const { position: newPosition, rotation: newRotation, animation } = predefinedPath[replayIndex];
        setPosition(newPosition);
        setRotation(newRotation);
        setCurrentAnimation(animation);
        replay.current++;
      } else {
        replay.current = 0; // Reset replay index after completion
      }
    }
  });

  // Handle animation playback
  React.useEffect(() => {
    if (actions[currentAnimation]) {
      actions[currentAnimation].reset().fadeIn(0.24).play();
    }
    return () => actions?.[currentAnimation]?.fadeOut(0.24);
  }, [currentAnimation]);

  return (
    <>
    <primitive object={cityScene} scale={1}/>
    <mesh ref={group} position={position} rotation={rotation}>
      <primitive object={scene} scale={2} rotation={[0,Math.PI,0]} />
    </mesh>
    </>
  );
};

const App = () => {
  const [isReplaying, setIsReplaying] = useState(false);
  const replayIndex = useRef(0);

  // Predefined path data


  const handleReplay = () => {
    replayIndex.current = 0; // Reset replay index
    setIsReplaying(true);
    setTimeout(() => setIsReplaying(false), predefinedPath.length * 500); // Adjust timing based on path length
  };

  useEffect(()=>{
    replayIndex.current = 0; // Reset replay index
    setIsReplaying(true);
  },[])

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={1} />
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
        <Box predefinedPath={predefinedPath} replay={isReplaying ? replayIndex : null} />
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
       {/*  <button onClick={handleReplay}>Replay Predefined Path</button> */}
      </div>
    </div>
  );
};

export default App;
 

/* import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF, useAnimations } from "@react-three/drei";
import {predefinedPath} from "./path"; // Import the predefined path
import * as THREE from 'three';
import Character from '../src/assets/Character/Character.glb';

const Box = ({ predefinedPath, replay }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(Character); // Load the GLTF model
  const { actions } = useAnimations(animations, group); // Handle animations
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]); // Store rotation as Euler angles
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  useFrame(() => {
    if (replay) {
      const replayIndex = replay.index;
      if (replayIndex < replay.path.length) {
        const { position: newPosition, rotation: newRotation, animation } = replay.path[replayIndex];
        setPosition(newPosition);
        setRotation(newRotation);
        setCurrentAnimation(animation);
        replay.index++;
      } else {
        replay.onComplete(); // Call the completion handler
      }
    }
  });

  // Handle animation playback
  useEffect(() => {
    if (actions[currentAnimation]) {
      actions[currentAnimation].reset().fadeIn(0.24).play();
    }
    return () => actions?.[currentAnimation]?.fadeOut(0.24);
  }, [currentAnimation]);

  return (
    <mesh ref={group} position={position} rotation={rotation}>
      <primitive object={scene} scale={2} />
    </mesh>
  );
};

const App = () => {
  const [isReplaying, setIsReplaying] = useState(false);
  const [reverse, setReverse] = useState(false); // Track reversal state
  const replayIndex = useRef(0);
  const replayPath = useRef(predefinedPath);

  const handleReplay = () => {
    replayIndex.current = 0;
    replayPath.current = reverse ? [...predefinedPath].reverse() : [...predefinedPath];
    setIsReplaying(true);
  };

  const handleReplayComplete = () => {
    if (!reverse) {
      setReverse(true); // Reverse the path on completion
      handleReplay();
    } else {
      setIsReplaying(false); // Stop replay after reverse completion
      setReverse(false);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={1} />
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
        {isReplaying && (
          <Box
            predefinedPath={predefinedPath}
            replay={{
              path: replayPath.current,
              index: replayIndex.current,
              onComplete: handleReplayComplete,
            }}
          />
        )}
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={handleReplay}>Replay Predefined Path</button>
      </div>
    </div>
  );
};

export default App; */
