"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { predefinedPath } from "./path1";
import { predefinedPath1 } from "./path2";
import { predefinedPath2 } from "./path";
import { SkeletonUtils } from "three-stdlib";
import { CapsuleCollider, Physics, RigidBody } from "@react-three/rapier";

import C from "../src/assets/Character/Character.glb";
import City from "../src/assets/Hall/park_scene_new_c.glb";

const Character = ({ predefinedPath, replay, index }) => {
  const group = useRef();
  const parentGroup = useRef();

  const { scene, animations, nodes } = useGLTF(C);
  const { actions } = useAnimations(animations, group);

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Hide the head and apply random color to the hair for each clone
  useEffect(() => {
    if (clone) {
      console.log("Customizing cloned model nodes:");
      clone.traverse((child) => {
   
        if (index === 1) {
          if (child.material) {
            child.material.transparent = true; // Allow transparency adjustments
            child.material.opacity = 0.5; // Ensure visible
          }
          if (child.name === "mixamorigRightArm") {
            console.log("Hiding:", child.name); // Debug output
            child.visible = true;
          }
        }
      });
    }
  }, [clone, index]);
  

  const [position, setPosition] = useState(
    new THREE.Vector3(...(predefinedPath[0]?.position || [0, 0, 0]))
  );
  const [rotation, setRotation] = useState(
    new THREE.Euler(...(predefinedPath[0]?.rotation || [0, 0, 0]))
  );
  const [currentAnimation, setCurrentAnimation] = useState(
    "CharacterArmature|Walk"
  );

  useFrame(() => {
    if (replay && replay.current[index] < predefinedPath.length) {
      const {
        position: newPosition,
        rotation: newRotation,
        animation,
      } = predefinedPath[replay.current[index]];

      if (newPosition && newRotation && animation) {
        setPosition((prev) =>
          prev.lerp(new THREE.Vector3(...newPosition), 0.001)
        ); // Adjust interpolation speed
        setRotation((prev) =>
          new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion()
              .slerp(
                new THREE.Quaternion().setFromEuler(prev),
                0.1
              )
              .multiply(
                new THREE.Quaternion().setFromEuler(
                  new THREE.Euler(...newRotation)
                )
              )
          )
        );
        setCurrentAnimation(animation);
      }
      replay.current[index]++;
    }

    if (replay && replay.current[index] >= predefinedPath.length) {
      replay.current[index] = 0; // Reset to the beginning of the path
    }
  });

  useEffect(() => {
    if (actions[currentAnimation]) {
      actions[currentAnimation].reset().fadeIn(0.24).play();
    }
    return () => actions?.[currentAnimation]?.fadeOut(0.24);
  }, [currentAnimation, actions]);

  return (
    <RigidBody
      colliders={false}
      type="fixed"
      position={position.toArray()}
      rotation={rotation.toArray()}
      lockRotations
    >
      <group ref={parentGroup}>
        <group ref={group}>
          <primitive object={clone} scale={1} />
        </group>
      </group>
      <CapsuleCollider args={[0.7, 0.3]} position={[0, 1, 0]} />
    </RigidBody>
  );
};

const Plane = () => {
  return (
    <RigidBody type="fixed" colliders="hull">
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
    </RigidBody>
  );
};

const Ai_Character = () => {
  const [isReplaying, setIsReplaying] = useState(false);
  const replayIndex = useRef([0, 0, 0]); // Track replay index for all characters

  useEffect(() => {
    replayIndex.current = [0, 0, 0]; // Reset the replay index for all characters
    setIsReplaying(true);
  }, []);

  const characters = [
    { path: predefinedPath, index: 0 },
    { path: predefinedPath1, index: 1 },
    { path: predefinedPath2, index: 2 },
  ];

  return (
    <Canvas style={{ height: "100vh" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
      <OrbitControls />
      <Grid infiniteGrid={true} />
      <Physics debug={true}>
        <Plane />
        {characters.map(({ path, index }) => (
          <Character
            key={index}
            predefinedPath={path}
            replay={isReplaying ? replayIndex : null}
            index={index}
          />
        ))}
      </Physics>
    </Canvas>
  );
};

export default Ai_Character;
