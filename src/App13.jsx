import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Grid } from "@react-three/drei";
import * as THREE from "three";
import Character1 from "../src/assets/Character/Animated Woman.glb";
import Character2 from "../src/assets/Character/Character.glb";
import City from '../src/assets/Hall/park_scene.glb';

const Box = ({
  characterModel,
  currentAnimation,
  setCurrentAnimation,
  setGlobalActions,
  keyAnimations,
  isRecording,
  setRecordedPath,
  replayPath,
  replay,
}) => {
  const group = useRef();
  const { scene, animations } = useGLTF(characterModel);
  const { actions: characterActions } = useAnimations(animations, group);
  const { scene: cityScene } = useGLTF(City);
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const keysPressed = useRef(new Set());
  const path = useRef([]);

  // Pass actions to parent
  useEffect(() => {
    setGlobalActions(characterActions);
  }, [characterActions, setGlobalActions]);

  // Animation logic
  useEffect(() => {
    if (characterActions && currentAnimation && characterActions[currentAnimation]) {
      characterActions[currentAnimation].reset().fadeIn(0.24).play();
    }
    return () => {
      if (characterActions && characterActions[currentAnimation]) {
        characterActions[currentAnimation].fadeOut(0.24);
      }
    };
  }, [currentAnimation, characterActions]);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      keysPressed.current.add(event.key);
      updateAnimation();
    };

    const handleKeyUp = (event) => {
      keysPressed.current.delete(event.key);
      updateAnimation();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyAnimations]);

  const updateAnimation = () => {
    if (keysPressed.current.has("w") && keysPressed.current.has("a")) {
      setCurrentAnimation(keyAnimations["wa"]);
    } else if (keysPressed.current.has("w") && keysPressed.current.has("d")) {
      setCurrentAnimation(keyAnimations["wd"]);
    } else if (keysPressed.current.has("s")) {
      setCurrentAnimation(keyAnimations["s"]);
    } else if (keysPressed.current.has("w")) {
      setCurrentAnimation(keyAnimations["w"]);
    } else if (keysPressed.current.has("a")) {
      setCurrentAnimation(keyAnimations["a"]);
    } else if (keysPressed.current.has("d")) {
      setCurrentAnimation(keyAnimations["d"]);
    } else {
      setCurrentAnimation("CharacterArmature|Idle");
    }
  };

  // Movement and recording logic
  useFrame(() => {
    let newPosition = [...position];
    let newRotation = [...rotation];
  
    const forward = new THREE.Vector3(0, 0, -0.04);
    const backward = new THREE.Vector3(0, 0, 0.04);
    const rotationSpeed = 0.05;

    // Apply movement based on all keys currently pressed
    if (keysPressed.current.has("s")) {
      forward.applyEuler(new THREE.Euler(0, newRotation[1], 0));
      newPosition = [newPosition[0] + forward.x, newPosition[1], newPosition[2] + forward.z];
    }

    if (keysPressed.current.has("w")) {
      backward.applyEuler(new THREE.Euler(0, newRotation[1], 0));
      newPosition = [newPosition[0] + backward.x, newPosition[1], newPosition[2] + backward.z];
    }

    if (keysPressed.current.has("a")) {
      newRotation[1] -= rotationSpeed;
    }

    if (keysPressed.current.has("d")) {
      newRotation[1] += rotationSpeed;
    }

    setPosition(newPosition);
    setRotation(newRotation);

    // Record the path if recording is active
    if (isRecording) {
      path.current.push({
        position: newPosition.map((val) => parseFloat(val.toFixed(3))), // Round to 3 decimal places
        rotation: newRotation.map((val) => parseFloat(val.toFixed(3))),
        animation: currentAnimation,
      });
    }
  });

  // Save recorded path
  useEffect(() => {
    if (!isRecording) {
      setRecordedPath([...path.current]);
    }
  }, [isRecording, setRecordedPath]);

  // Replay logic
  const replayIndex = useRef(0);
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
    <>
      <primitive object={cityScene} scale={1} />
      <group ref={group} position={position} rotation={rotation}>
        <primitive object={scene} scale={2} />
      </group>
    </>
  );
};

const App = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState("CharacterArmature|Idle");
  const [globalActions, setGlobalActions] = useState({});
  const [keyAnimations, setKeyAnimations] = useState({
    w: "CharacterArmature|Walk",
    a: "CharacterArmature|LeftTurn",
    s: "CharacterArmature|Backward",
    d: "CharacterArmature|RightTurn",
    wa: "CharacterArmature|WalkLeft", // 'w' + 'a'
    wd: "CharacterArmature|WalkRight", // 'w' + 'd'
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordedPath, setRecordedPath] = useState([]);
  const [replay, setReplay] = useState(false);

  const handleAnimationChange = (key, animation) => {
    setKeyAnimations((prev) => ({ ...prev, [key]: animation }));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleReplay = () => {
    if (recordedPath.length > 0) {
      setReplay(true);
      setTimeout(() => setReplay(false), recordedPath.length * 100);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedCharacter(url);
    }
  };

  const handleCopyPath = () => {
    if (recordedPath.length > 0) {
      const formattedPath = JSON.stringify(
        recordedPath.map(({ position, rotation, animation }) => ({
          position,
          rotation,
          animation,
        })),
        null,
        2 // Indented JSON format
      );
  
      navigator.clipboard.writeText(formattedPath).then(() => {
        alert("Recorded path copied to clipboard!");
      });
    } else {
      alert("No recorded path to copy!");
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls />
        <Grid infiniteGrid cellSize={1} sectionSize={10} fadeDistance={30} position={[0, 0, 0]} />
        {selectedCharacter && (
          <Box
            characterModel={selectedCharacter}
            currentAnimation={currentAnimation}
            setCurrentAnimation={setCurrentAnimation}
            setGlobalActions={setGlobalActions}
            keyAnimations={keyAnimations}
            isRecording={isRecording}
            setRecordedPath={setRecordedPath}
            replayPath={recordedPath}
            replay={replay}
          />
        )}
      </Canvas>

      {/* UI for key bindings */}
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={() => setSelectedCharacter(Character1)}>Select Character 1</button>
        <button onClick={() => setSelectedCharacter(Character2)}>Select Character 2</button>
        <input type="file" accept=".glb" onChange={handleFileSelect} />
        <button onClick={toggleRecording}>{isRecording ? "Stop Recording" : "Start Recording"}</button>
        <button onClick={handleReplay}>Replay</button>

        {/* Display available animations and allow key assignment */}
        <div>
          {Object.keys(keyAnimations).map((key) => (
            <div key={key}>
              <label>{key} Animation:</label>
              <input
                type="text"
                value={keyAnimations[key]}
                onChange={(e) => handleAnimationChange(key, e.target.value)}
                style={{ marginRight: "10px" }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 10, left: 10 }}>
        <button onClick={handleCopyPath}>Copy Recorded Path</button>
      </div>
    </div>
  );
};

export default App;
