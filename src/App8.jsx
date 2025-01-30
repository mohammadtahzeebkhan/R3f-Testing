import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import A from '../src/assets/audio.mp3';

function Box({ position, attachAudioListener }) {
  const meshRef = useRef();

  useEffect(() => {
    if (attachAudioListener && meshRef.current) {
      const listener = new THREE.AudioListener();
      attachAudioListener(listener); // Pass listener to parent
      meshRef.current.add(listener);
    }
  }, [attachAudioListener]);

  return (
    <mesh position={position} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function StaticBoxWithAudio({ position, audioFile }) {
  const meshRef = useRef();
  const { camera } = useThree();
  const [soundReady, setSoundReady] = useState(false); // Track when sound is ready

  useEffect(() => {
    const audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    const sound = new THREE.PositionalAudio(audioListener);
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(audioFile, (buffer) => {
      sound.setBuffer(buffer);
      sound.setRefDistance(1);
      sound.setLoop(true);
      sound.play();
      setSoundReady(true); // Indicate that sound is ready to play
    });

    if (meshRef.current) {
      meshRef.current.add(sound);
    }

    // Cleanup
    return () => {
      sound.stop();
    };
  }, [audioFile, camera]);

  return (
    <mesh position={position} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={soundReady ? "green" : "red"} />
    </mesh>
  );
}

function App() {
  const [boxPosition, setBoxPosition] = useState([0, 0.5, 0]);
  const [audioFile] = useState(A); // Set audio file to be used

  useEffect(() => {
    const handleKeyDown = (event) => {
      setBoxPosition((prev) => {
        const [x, y, z] = prev;
        switch (event.key) {
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Canvas>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[5, 5, 5]} />
      <OrbitControls />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Grid */}
      <gridHelper args={[10, 10, "white", "gray"]} />

      {/* Dynamic Box with Audio Listener */}
      {audioFile && <Box position={boxPosition} attachAudioListener={() => {}} />}

      {/* Static Box with Audio Source */}
      <StaticBoxWithAudio position={[2, 0.5, -2]} audioFile={audioFile} />
    </Canvas>
  );
}

export default App;
