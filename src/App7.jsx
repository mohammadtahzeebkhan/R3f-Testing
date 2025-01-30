import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import A from "../src/assets/audio.mp3";

function AudioSource({ audioFile, position, playAudio, pauseAudio, stopAudio }) {
  const meshRef = useRef();
  const soundRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Create an AudioListener for the scene
    const listener = new THREE.AudioListener();

    // Create the PositionalAudio object and load the audio
    const sound = new THREE.PositionalAudio(listener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(
      audioFile,
      (buffer) => {
        sound.setBuffer(buffer);
        sound.setRefDistance(2);
        sound.setDirectionalCone(180, 230, 0.1);
        // volume increase from 1 from other audio hv noise
        sound.setVolume(100)
        soundRef.current = sound;

        if (playAudio) {
          console.log("Attempting to play audio");
          sound.play();
          setIsPlaying(true); // Mark as playing
        }
      },
      undefined, // Optional progress callback
      (error) => console.error("Audio loading error:", error)
    );

    // Add the sound to the mesh
    if (meshRef.current) {
      meshRef.current.add(sound);
    }


    if (stopAudio && soundRef.current) {
      soundRef.current.stop();
      setIsPlaying(false);
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.stop(); // Stop sound when the component unmounts
      }
    };
  }, [audioFile, playAudio, pauseAudio, stopAudio]);

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={0xff2200} />
    </mesh>
  );
}

function DynamicBoxWithAudioListener({ position }) {
  const meshRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    // Create an AudioListener for the box
    const listener = new THREE.AudioListener();
    camera.add(listener); // Add the listener to the camera

    // Attach the AudioListener to the box
    if (meshRef.current) {
      meshRef.current.add(listener);
    }

    return () => {
      if (meshRef.current) {
        meshRef.current.remove(listener);
      }
    };
  }, [camera]);

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}

function App() {
  const [boxPosition, setBoxPosition] = useState([2, 0.5, 2]);
  const [playAudio, setPlayAudio] = useState(false);

  const [stopAudio, setStopAudio] = useState(false);

  useEffect(() => {
    // Attempt to start audio playback when the page loads
    //setPlayAudio(true);
  }, []);

  const moveBox = (direction) => {
    setBoxPosition((prev) => {
      const [x, y, z] = prev;
      switch (direction) {
        case "w": // Move forward
          return [x, y, z - 0.5];
        case "s": // Move backward
          return [x, y, z + 0.5];
        case "a": // Move left
          return [x - 0.5, y, z];
        case "d": // Move right
          return [x + 0.5, y, z];
        default:
          return prev;
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      moveBox(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <Canvas style={{ height: "100vh" }}>
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[3, 2, 3]} />
        <OrbitControls />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 0]} intensity={1} castShadow />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {/* Grid and floor */}
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color={0xcbcbcb} />
        </mesh>
        <gridHelper args={[50, 50]} />

        {/* Audio Source (for example, a sphere emitting sound) */}
        <AudioSource
          audioFile={A}
          position={[0, 1, 0]}
          playAudio={playAudio}
       
        />

        {/* Dynamic Box with Audio Listener */}
        <DynamicBoxWithAudioListener position={boxPosition} />
      </Canvas>

      {/* Audio Controls */}
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 100 }}>
        <button onClick={(e) => setPlayAudio(true)}>Play</button>
       
        <button onClick={(e) => setStopAudio(true)}>Stop</button>
        <h1>wasd key move box as audio Listener</h1>
      </div>
    </div>
  );
}

export default App;
