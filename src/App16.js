/* import React, { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Grid } from "@react-three/drei";
import { CapsuleCollider, Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

// Import assets and paths
import C2 from "../src/assets/Character/AnimatedWoman4.glb";
import Character1 from "../src/assets/Character/AnimatedWoman.glb";
import Character2 from "../src/assets/Character/Character.glb";
import City from "../src/assets/Hall/park_scene_new_c.glb";
import { predefinedPath } from "./path1";
import { predefinedPath1 } from "./path2";

const defaultPath = [
  { position: [0, 0, 0], rotation: [0, 0, 0], animation: "CharacterArmature|Idle" },
];

const CharacterWithCollider = ({ predefinedPath = defaultPath, replay, index, modelPath }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(C2);
  const { actions } = useAnimations(animations, group);

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const [position, setPosition] = useState(predefinedPath[0]?.position || [0, 0, 0]);
  const [rotation, setRotation] = useState(predefinedPath[0]?.rotation || [0, 0, 0]);
  const [currentAnimation, setCurrentAnimation] = useState(predefinedPath[0]?.animation || "CharacterArmature|Idle");

  // Replay path
  useFrame(() => {
    if (replay && replay.current[index] < predefinedPath.length) {
      const { position: newPosition, rotation: newRotation, animation } = predefinedPath[replay.current[index]] || {};
      if (newPosition && newRotation && animation) {
        setPosition(newPosition);
        setRotation(newRotation);
        setCurrentAnimation(animation);
      }
      replay.current[index]++;
    } else if (replay && replay.current[index] >= predefinedPath.length) {
      replay.current[index] = 0; // Reset replay index
    }
  });

  // Play animation
  useEffect(() => {
    if (actions[currentAnimation]) {
      actions[currentAnimation].reset().fadeIn(0.24).play();
    }
    return () => actions?.[currentAnimation]?.fadeOut(0.24);
  }, [currentAnimation, actions]);

  return (
    <RigidBody
    colliders={false}
    type="dynamic"
    // position={[2, -30, 0]}
    position={position}
    lockRotations
    
  >
      <group ref={group}>
        <primitive object={clone} scale={1} />
      </group>
      <CapsuleCollider args={[0.7, 0.3]}  />
    </RigidBody>
  );
};

const App = () => {
  const [isReplaying, setIsReplaying] = useState(false);
  const replayIndex = useRef([0, 0]);

  useEffect(() => {
    replayIndex.current = [0, 0];
    setIsReplaying(true);
  }, []);

  const handleReplay = () => {
    replayIndex.current = [0, 0];
    setIsReplaying(true);
    setTimeout(() => setIsReplaying(false), 10000); // Stop replay after 10 seconds
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls />
        <Grid infiniteGrid cellSize={1} sectionSize={10} fadeDistance={30} />

        <Physics  debug={true}>
          <CharacterWithCollider predefinedPath={predefinedPath} replay={isReplaying ? replayIndex : null}  />
          <CharacterWithCollider predefinedPath={predefinedPath1} replay={isReplaying ? replayIndex : null}  />
        </Physics>
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={handleReplay}>Replay</button>
      </div>
    </div>
  );
};

export default App;
 */


import React, { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Grid } from "@react-three/drei";
import { CapsuleCollider, Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";

// Import assets and paths
import C2 from "../src/assets/Character/AnimatedWoman4.glb";
import Character1 from "../src/assets/Character/AnimatedWoman.glb";
import Character2 from "../src/assets/Character/Character.glb";
import City from "../src/assets/Hall/park_scene_new_c.glb";
import { predefinedPath } from "./path1";
import { predefinedPath1 } from "./path2";

const defaultPath = [
  { position: [0, 0, 0], rotation: [0, 0, 0], animation: "CharacterArmature|Idle" },
];

const CharacterWithCollider = ({ predefinedPath = defaultPath, replay, index }) => {
  const group = useRef();
  const parentGroup = useRef(); // Reference for the parent group
  const { scene, animations } = useGLTF(C2);
  const { actions } = useAnimations(animations, group);

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const [position, setPosition] = useState(new THREE.Vector3(...(predefinedPath[0]?.position || [0, 0, 0])));
  const [rotation, setRotation] = useState(new THREE.Euler(...(predefinedPath[0]?.rotation || [0, 0, 0])));
  const [currentAnimation, setCurrentAnimation] = useState(predefinedPath[0]?.animation || "CharacterArmature|Idle");

  // Replay path
  useFrame(() => {
    if (replay && replay.current[index] < predefinedPath.length) {
      const { position: newPosition, rotation: newRotation, animation } = predefinedPath[replay.current[index]] || {};

      if (newPosition && newRotation && animation) {
        // Interpolate position and rotation
        setPosition((prev) => prev.lerp(new THREE.Vector3(...newPosition), 0.1)); // Interpolate position
        setRotation((prev) => new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion().slerp(new THREE.Quaternion().setFromEuler(prev), 0.1).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(...newRotation))),
        )); // Interpolate rotation using quaternion slerp
        setCurrentAnimation(animation);
      }
      replay.current[index]++;
    }
  });

  // Play animation
  useEffect(() => {
    if (actions[currentAnimation]) {
      actions[currentAnimation].reset().fadeIn(0.24).play();
    }
    return () => actions?.[currentAnimation]?.fadeOut(0.24);
  }, [currentAnimation, actions]);

  return (
    <RigidBody colliders={false} type="dynamic" position={position.toArray()} rotation={rotation.toArray()} lockRotations>
      <group ref={parentGroup}>
        <group ref={group}>
          <primitive object={clone} scale={2} />
        </group>
      </group>
      <CapsuleCollider args={[2, 0.8]} position={[0, 1.1, 0]} />
    </RigidBody>
  );
};

const App = () => {
  const [isReplaying, setIsReplaying] = useState(false);
  const replayIndex = useRef([0, 0]);

  useEffect(() => {
    replayIndex.current = [0, 0];
    setIsReplaying(true);
  }, []);

  const handleReplay = () => {
    replayIndex.current = [0, 0];
    setIsReplaying(true);
    setTimeout(() => setIsReplaying(false), 10000); // Stop replay after 10 seconds
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls />
        <Grid infiniteGrid cellSize={1} sectionSize={10} fadeDistance={30} />

        <Physics gravity={[0, 8, 0]} debug={true}>
          {/* Floor */}
          <RigidBody type="fixed" colliders={false}>
            <mesh receiveShadow>
              <boxGeometry args={[50, 1, 50]} /> {/* Floor dimensions */}
              <meshStandardMaterial color="#6c6c6c" />
            </mesh>
          
          </RigidBody>

          {/* Characters */}
          <CharacterWithCollider
            predefinedPath={predefinedPath}
            replay={isReplaying ? replayIndex : null}
            index={0}
            modelPath={Character1}
          />
          <CharacterWithCollider
            predefinedPath={predefinedPath1}
            replay={isReplaying ? replayIndex : null}
            index={1}
            modelPath={Character2}
          />
        </Physics>
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={handleReplay}>Replay</button>
      </div>
    </div>
  );
};

export default App;
