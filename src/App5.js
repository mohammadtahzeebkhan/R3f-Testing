import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import Character from "../src/assets/Character/Animated Woman.glb"; // Replace with the correct path

const CharacterBox = ({
  characterId,
  isRecording,
  setRecordedPath,
  replayPath,
  replay,
  initialPosition,
}) => {
  const group = useRef();
  const { scene, animations } = useGLTF(Character);
  const { actions } = useAnimations(animations, group);
  const [currentAnimation, setCurrentAnimation] = useState("CharacterArmature|Idle");
  const path = useRef([]);
  const [position, setPosition] = useState(initialPosition);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const keysPressed = useRef(new Set());

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
      setCurrentAnimation("CharacterArmature|Idle");
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
    const forward = new THREE.Vector3(0, 0, -0.04);
    const rotationSpeed = 0.05;

    if (keysPressed.current.has("w")) {
      setCurrentAnimation("CharacterArmature|Walk");
      forward.applyEuler(new THREE.Euler(0, newRotation[1], 0));
      newPosition = [newPosition[0] + forward.x, newPosition[1], newPosition[2] + forward.z];
    }

    if (keysPressed.current.has("a")) {
      newRotation[1] -= rotationSpeed;
    }

    if (keysPressed.current.has("d")) {
      newRotation[1] += rotationSpeed;
    }

    setPosition(newPosition);
    setRotation(newRotation);

    if (isRecording) {
      path.current.push({
        position: newPosition,
        rotation: newRotation,
        animation: currentAnimation,
      });
    }
  });

  useEffect(() => {
    if (!isRecording) {
      setRecordedPath(characterId, [...path.current]);
    }
  }, [isRecording, setRecordedPath]);

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
    <mesh ref={group} position={position} rotation={rotation}>
      <primitive object={scene} scale={2} rotation={[0, -Math.PI, 0]} />
    </mesh>
  );
};

const App = () => {
  const [characters, setCharacters] = useState([
    { id: 1, position: [-3, 0, -3], recordedPath: [], isRecording: false, replay: false },
    { id: 2, position: [0, 0, 0], recordedPath: [], isRecording: false, replay: false },
    { id: 3, position: [3, 0, 3], recordedPath: [], isRecording: false, replay: false },
  ]);

  const toggleRecording = (id) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id ? { ...char, isRecording: !char.isRecording } : char
      )
    );
  };

  const handleReplay = (id) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id ? { ...char, replay: true } : char
      )
    );
    setTimeout(() => {
      setCharacters((prev) =>
        prev.map((char) =>
          char.id === id ? { ...char, replay: false } : char
        )
      );
    }, 5000);
  };

  const setRecordedPath = (id, path) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === id ? { ...char, recordedPath: path } : char
      )
    );
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
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
        {characters.map((char) => (
          <CharacterBox
            key={char.id}
            characterId={char.id}
            isRecording={char.isRecording}
            setRecordedPath={setRecordedPath}
            replayPath={char.recordedPath}
            replay={char.replay}
            initialPosition={char.position}
          />
        ))}
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        {characters.map((char) => (
          <div key={char.id} style={{ marginBottom: "10px" }}>
            <button onClick={() => toggleRecording(char.id)}>
              {char.isRecording ? `Stop Recording Character ${char.id}` : `Start Recording Character ${char.id}`}
            </button>
            <button onClick={() => handleReplay(char.id)}>
              Play Character {char.id}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
