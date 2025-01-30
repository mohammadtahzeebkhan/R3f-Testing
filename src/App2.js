import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import Character from "../src/assets/Character/Character.glb"; // Replace with the correct path
import City from '../src/assets/Hall/city.glb'
const Box = ({ isRecording, setRecordedPath, replayPath, replay }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(Character); // Load the GLTF model
  const { scene: cityScene } = useGLTF(City);
  const { actions } = useAnimations(animations, group); // Handle animations
  const [currentAnimation, setCurrentAnimation] = useState("idle");
//console.log("actions",actions)
  // Record path including position, rotation, and animation
  const path = useRef([]);
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const keysPressed = useRef(new Set());

  // Update animation based on state
  useEffect(() => {
    if (actions[currentAnimation]) {
      actions[currentAnimation].reset().fadeIn(0.24).play();
    }
    return () => actions?.[currentAnimation]?.fadeOut(0.24);
  }, [currentAnimation]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      keysPressed.current.add(event.key);
    };

    const handleKeyUp = (event) => {
      keysPressed.current.delete(event.key);
      setCurrentAnimation("idle"); // Reset animation to idle on keyup
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    let newPosition = [...position];
    let newRotation = [...rotation];

    // Movement and animation logic
    const forward = new THREE.Vector3(0, 0, -0.1); // Movement step size
    const backward = new THREE.Vector3(0, 0, 0.1);
    const rotationSpeed = 0.05; // Rotation speed

    if (keysPressed.current.has("w")) {
      setCurrentAnimation("Walking"); 
      forward.applyEuler(new THREE.Euler(0, newRotation[1], 0)); // Move forward based on rotation
      newPosition = [newPosition[0] + forward.x, newPosition[1], newPosition[2] + forward.z];
     // Set animation to walking
     //newRotation[1] = Math.PI
    }
    if (keysPressed.current.has("j")) {
      setCurrentAnimation("Jumping");  
      //backward.applyEuler(new THREE.Euler(0, newRotation[1], 0)); // Move backward based on rotation
     
    }

    if (keysPressed.current.has("r")) {
      setCurrentAnimation("Right Turn");  
      //backward.applyEuler(new THREE.Euler(0, newRotation[1], 0)); // Move backward based on rotation
     
    }

    if (keysPressed.current.has("l")) {
      setCurrentAnimation("Left Turn");  
      //backward.applyEuler(new THREE.Euler(0, newRotation[1], 0)); // Move backward based on rotation
     
    }

    if (keysPressed.current.has("s")) {
      backward.applyEuler(new THREE.Euler(0, newRotation[1], 0)); // Move backward based on rotation
      newPosition = [newPosition[0] + backward.x, newPosition[1], newPosition[2] + backward.z];
      newRotation[1] = -Math.PI
      setCurrentAnimation("Walking"); 
    }

    // Rotation logic (left and right)
    if (keysPressed.current.has("a")) {
      newRotation[1] -= rotationSpeed; // Rotate left (counter-clockwise)
    }

    if (keysPressed.current.has("d")) {
      newRotation[1] += rotationSpeed; // Rotate right (clockwise)
    }

    // Set the new position and rotation
    setPosition(newPosition);
    setRotation(newRotation);

    if (isRecording) {
      // Record position, rotation, and animation state
      path.current.push({
        position: newPosition,
        rotation: newRotation,
        animation: currentAnimation,
      });
    }
  });

  useEffect(() => {
    if (!isRecording) {
      setRecordedPath([...path.current]);
    }
  }, [isRecording, setRecordedPath]);

  // Replay logic for position, rotation, and animation
  let replayIndex = useRef(0);
  useFrame(() => {
    if (replay) {
      if (replayIndex.current < replayPath.length) {
        const { position, rotation, animation } = replayPath[replayIndex.current];
        setPosition(position);
        setRotation(rotation);
        setCurrentAnimation(animation); // Update animation on replay
        replayIndex.current++;
      }
    }
  });

  return (
    <mesh>

<primitive object={cityScene} scale={1}/>
   
    <mesh ref={group} position={position} rotation={rotation}>
    
      {/* Display GLTF model */}
      <primitive object={scene} scale={2} rotation={[0,-Math.PI,0]}/>
    </mesh>
    </mesh>
  );
};

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPath, setRecordedPath] = useState([]);
  const [replay, setReplay] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      console.log("Recording stopped");
    } else {
      console.log("Recording started",recordedPath);
    }
  };

  const handleReplay = () => {
    if (recordedPath.length > 0) {
      console.log("record data",recordedPath)
      setReplay(true);
      setTimeout(() => setReplay(false), recordedPath.length * 100); // Adjust time based on path length
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={10} />
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
        <Box
          isRecording={isRecording}
          setRecordedPath={setRecordedPath}
          replayPath={recordedPath}
          replay={replay}
        />
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={toggleRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button onClick={handleReplay}>Replay</button>
      </div>
    </div>
  );
};

export default App;
