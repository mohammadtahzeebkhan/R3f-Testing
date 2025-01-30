import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { InstancedMesh, Object3D, AnimationMixer, Clock } from "three";
import { useGLTF, Stats, OrbitControls } from "@react-three/drei";
import * as THREE from 'three'
import H from '../src/assets/Horse.glb'
const InstancedScene = ({ modelPath, instanceCount = 1024 }) => {
  const meshRef = useRef();
  const dummyObject = useRef(new Object3D());
  const clock = useRef(new Clock());
  const mixers = useRef([]);
  const timeOffsets = useRef([]);

  // Load the model using drei's useGLTF hook
  const { scene, animations } = useGLTF(modelPath);

 useEffect(() => {
    if (scene && animations) {
      const instancedMesh = meshRef.current;

  /*     for (let i = 0; i < instanceCount; i++) {
        const x = i % 32;
        const y = Math.floor(i / 32);

        // Set position and transform for each instance
        dummyObject.current.position.set(
          5000 - 300 * x + 200 * Math.random(),
          0,
          5000 - 300 * y
        );
        dummyObject.current.updateMatrix();
        instancedMesh.setMatrixAt(i, dummyObject.current.matrix);

        // Set random colors for each instance
        instancedMesh.setColorAt(
          i,
          new THREE.Color(`hsl(${Math.random() * 360}, 50%, 66%)`)
        );

        // Set random animation time offsets
        timeOffsets.current[i] = Math.random() * 3;

        // Setup animation mixer
        const mixer = new AnimationMixer(scene);
        const action = mixer.clipAction(animations[0]);
        action.play();
        mixers.current.push(mixer);
      } */

      instancedMesh.instanceMatrix.needsUpdate = true;
    }
  }, [scene, animations, instanceCount]);

  // Animation loop
  useFrame(() => {
    const time = clock.current.getElapsedTime();
    mixers.current.forEach((mixer, i) => {
      mixer.setTime(time + timeOffsets.current[i]);
    });
  }); 

  return (
    <primitive ref={instancedMesh} object={scene} scale={2} rotation={[0, -Math.PI, 0]} />
  );
};

const App = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1500, 3000], fov: 60 }}
      style={{ height: "100vh", width: "100vw" }}
    >
      <color attach="background" args={["#99DDFF"]} />
      <fog attach="fog" args={["#99DDFF", 5000, 10000]} />
      <directionalLight
        position={[200, 1000, 50]}
        intensity={1}
        castShadow
        shadow-camera-left={-5000}
        shadow-camera-right={5000}
        shadow-camera-top={5000}
        shadow-camera-bottom={-5000}
        shadow-camera-far={2000}
        shadow-bias={-0.01}
      />
      <hemisphereLight args={["#99DDFF", "#669933", 1 / 3]} />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1000000, 1000000]} />
        <meshStandardMaterial color="#669933" />
      </mesh>
      <InstancedScene modelPath={H} />
      <Stats />
      <OrbitControls />
    </Canvas>
  );
};

export default App;
