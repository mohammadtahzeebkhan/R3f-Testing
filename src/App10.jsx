import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Character from "../src/assets/Character/Animated Woman.glb";
import Character1 from "../src/assets/Character/Character.glb";
import City from "../src/assets/Hall/city.glb";

const Box = ({
  model,
  animationsMap,
  isRecording,
  setRecordedPath,
  replayPath,
  replay,
  isActive,
  setActive,
  initialPosition,
}) => {
  const group = useRef();
  const { scene, animations } = useGLTF(model);
  const [mixer, setMixer] = useState(null);

  const [currentAnimation, setCurrentAnimation] = useState("idle"); // Initially set to "idle"
  const path = useRef([]);
  const [position, setPosition] = useState(initialPosition || [0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]); // Rotation state
  const keysPressed = useRef(new Set());

  // Initialize AnimationMixer when model is loaded
  useEffect(() => {
    const newMixer = new THREE.AnimationMixer(scene);
    animations.forEach((clip) => newMixer.clipAction(clip).play());  // Play all animations initially
    setMixer(newMixer);
    return () => {
      newMixer.stopAllAction();
    };
  }, [scene, animations]);

  // Handle animations
  useEffect(() => {
    if (!mixer || !animationsMap[currentAnimation]) return; // Check if mixer or animation exists
    
    const action = mixer.clipAction(animationsMap[currentAnimation]);
    if (action) {
      action.reset().fadeIn(0.24).play();
    } else {
      console.warn(`Animation "${animationsMap[currentAnimation]}" not found.`);
    }

    return () => {
      if (action) {
        action.fadeOut(0.24);
      }
    };
  }, [currentAnimation, mixer, animationsMap]);

  // Key events for controlling active character only
  useEffect(() => {
    if (!isActive) return;  // Only listen to key presses if this character is active

    const handleKeyDown = (event) => {
      keysPressed.current.add(event.key);
    };
    const handleKeyUp = (event) => {
      keysPressed.current.delete(event.key);
      if (!keysPressed.current.size) setCurrentAnimation("idle"); // Set to idle when no keys are pressed
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isActive]);

  useFrame((state, delta) => {
    if (!isActive || !mixer) return;

    mixer.update(delta);  // Update the animation mixer

    let newPosition = [...position];
    let newRotation = [...rotation];
    const movementStep = 0.04;
    const rotationSpeed = 0.05;

    // Movement logic based on facing direction
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, rotation[1], 0));
    const backward = new THREE.Vector3(0, 0, 1).applyEuler(new THREE.Euler(0, rotation[1], 0));

    if (keysPressed.current.has("w")) {
      setCurrentAnimation("walk");
      newPosition[0] += forward.x * movementStep;
      newPosition[1] += forward.y * movementStep;
      newPosition[2] += forward.z * movementStep;
    }
    if (keysPressed.current.has("s")) {
      setCurrentAnimation("walk_back");
      newPosition[0] += backward.x * movementStep;
      newPosition[1] += backward.y * movementStep;
      newPosition[2] += backward.z * movementStep;
    }
    if (keysPressed.current.has("a")) {
      setCurrentAnimation("turn_left");
      newRotation[1] += rotationSpeed;
    }
    if (keysPressed.current.has("d")) {
      setCurrentAnimation("turn_right");
      newRotation[1] -= rotationSpeed;
    }

    setPosition(newPosition);
    setRotation(newRotation);

    if (isRecording) {
      path.current.push({ position: newPosition, rotation: newRotation, animation: currentAnimation });
    }
  });

  useEffect(() => {
    if (!isRecording) {
      setRecordedPath([...path.current]);
    }
  }, [isRecording]);

  let replayIndex = useRef(0);
  useFrame(() => {
    if (replay) {
      if (replayIndex.current < replayPath.length) {
        const { position, rotation, animation } = replayPath[replayIndex.current];
        setPosition(position);
        setRotation(rotation);
        setCurrentAnimation(animation);
        replayIndex.current++;
      }
    }
  });

  return (
    <group onClick={() => setActive()}>
      <primitive object={scene} position={position} rotation={rotation} scale={2} />
      {isActive && (
        <mesh position={position} rotation={rotation} scale={2}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={"yellow"} wireframe={true} />
        </mesh>
      )}
    </group>
  );
};

const App = () => {
  const [isRecording1, setIsRecording1] = useState(false);
  const [recordedPath1, setRecordedPath1] = useState([]);
  const [replay1, setReplay1] = useState(false);
  const { scene: cityScene } = useGLTF(City);

  const [isRecording2, setIsRecording2] = useState(false);
  const [recordedPath2, setRecordedPath2] = useState([]);
  const [replay2, setReplay2] = useState(false);

  const [activeCharacter, setActiveCharacter] = useState(1); // 1 for Character1, 2 for Character2

  const handleReplayBoth = () => {
    setReplay1(true);
    setReplay2(true);
    setTimeout(() => {
      setReplay1(false);
      setReplay2(false);
    }, Math.max(recordedPath1.length, recordedPath2.length) * 100);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls />
        <primitive object={cityScene} scale={1} />
        <Grid infiniteGrid cellSize={1} cellThickness={1} sectionSize={10} sectionThickness={2} fadeDistance={30} fadeStrength={1} />

        {/* Character 1 */}
        <Box
          model={Character}
          animationsMap={{
            idle: "CharacterArmature|Idle",
            walk: "CharacterArmature|Walk",
            walk_back: "CharacterArmature|Run_Back",
            turn_left: "CharacterArmature|Turn_Left",
            turn_right: "CharacterArmature|Turn_Right",
          }}
          isRecording={isRecording1}
          setRecordedPath={setRecordedPath1}
          replayPath={recordedPath1}
          replay={replay1}
          isActive={activeCharacter === 1}
          setActive={() => setActiveCharacter(1)}
          initialPosition={[0, 0, 0]} // Set initial position for Character 1
        />

        {/* Character 2 */}
        <Box
          model={Character1}
          animationsMap={{
            idle: "idle",
            walk: "Walking",
            walk_back: "Running",
            turn_left: "Right Turn",
            turn_right: "Jumping",
          }}
          isRecording={isRecording2}
          setRecordedPath={setRecordedPath2}
          replayPath={recordedPath2}
          replay={replay2}
          isActive={activeCharacter === 2}
          setActive={() => setActiveCharacter(2)}
          initialPosition={[5, 0, 0]} // Set initial position for Character 2
        />
      </Canvas>

      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={() => setIsRecording1(!isRecording1)}>
          {isRecording1 ? "Stop Recording Character 1" : "Start Recording Character 1"}
        </button>
        <button onClick={() => setReplay1(true)}>Replay Character 1</button>
        <button onClick={() => setIsRecording2(!isRecording2)}>
          {isRecording2 ? "Stop Recording Character 2" : "Start Recording Character 2"}
        </button>
        <button onClick={() => setReplay2(true)}>Replay Character 2</button>
        <button onClick={handleReplayBoth}>Replay Both</button>
      </div>
    </div>
  );
};

export default App;
