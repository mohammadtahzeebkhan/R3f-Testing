import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Pathfinding } from "three-pathfinding";

import Character from "./assets/Character/Character.glb"; // Mixamo character

function Model({ url, position, scale, rotation, animationName, loop = true }) {
  const group = useRef();
  const { scene, animations } = useGLTF(url);
  const mixer = useRef();

  useEffect(() => {
    if (animations.length) {
      mixer.current = new THREE.AnimationMixer(scene);
      const clip = THREE.AnimationClip.findByName(animations, animationName);
      if (clip) {
        const action = mixer.current.clipAction(clip);
        action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce).play();
      }
    }
  }, [animations, scene, animationName, loop]);

  useFrame((state, delta) => mixer.current?.update(delta));

  return (
    <group ref={group} position={position} scale={scale} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
}

function PathFollower({
  url,
  path,
  speed = 0.02,
  scale,
  rotation,
  animationName,
  onPathComplete,
}) {
  const group = useRef();
  const [t, setT] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0); // Dynamic walking speed for animation

  useFrame(() => {
    setT((prev) => {
      const newT = prev + speed;
      if (newT >= 1) {
        onPathComplete(); // Trigger path change when end is reached
        return 0; // Reset to the beginning for the new path
      }
      return newT;
    });

    const distance = path.getPointAt(t).distanceTo(path.getPointAt(t + 0.01));
    setCurrentSpeed(distance); // Update speed based on the distance

  });

  // Get position and tangent (for orientation) along the path
  const position = path.getPointAt(t % 1);
  const tangent = path.getTangentAt(t % 1);

  // Update model position and orientation
  useEffect(() => {
    if (group.current) {
      group.current.position.copy(position);

      // Update rotation to face the tangent direction
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
      group.current.quaternion.copy(quaternion);
    }
  }, [position, tangent]);

  return (
    <Model
      ref={group}
      url={url}
      position={position.toArray()}
      scale={scale}
      rotation={rotation}
      animationName={animationName}
      loop={true}
    />
  );
}

function Scene() {
  const { camera } = useThree();
  const [path, setPath] = useState(generateZigZagPath()); // Initial zig-zag path

  useEffect(() => {
    camera.position.set(0, 4, 14);
  }, [camera]);

  function generateZigZagPath() {
    const points = [];
    const numPoints = 20;
    const stepSize = 1;

    for (let i = 0; i < numPoints; i++) {
      const x = i * stepSize;
      const z = (i % 2 === 0 ? 1 : -1) * Math.random() * 2; // Create a zig-zag effect with random variation on z
      points.push(new THREE.Vector3(x, 0, z));
    }

    const path = new THREE.CatmullRomCurve3(points, false); // Open path
    return path;
  }

  const handlePathComplete = () => {
    setPath(generateZigZagPath()); // Generate a new zig-zag path when the current path is completed
  };

  return (
    <>
      <OrbitControls enableDamping dampingFactor={0.12} enableZoom={false} />
      <gridHelper args={[12, 12]} />
      <directionalLight position={[0, 3, 3]} intensity={1} />

      {/* Path follower */}
      <PathFollower
        url={Character}
        path={path}
        speed={0.002}
        scale={[0.6, 0.6, 0.6]}
        animationName="Walking" // Use walking animation
        onPathComplete={handlePathComplete}
      />
    </>
  );
}

export default function App() {
  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <ambientLight intensity={4} />
      <OrbitControls />
      <Scene />
    </Canvas>
  );
}
