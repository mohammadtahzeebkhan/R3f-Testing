import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Character1 from "../src/assets/Character/Animated Woman.glb";
import Character2 from "../src/assets/Character/Character.glb";


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
      if (keyAnimations[event.key]) {
        setCurrentAnimation(keyAnimations[event.key]);
      }
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
  }, [keyAnimations, setCurrentAnimation]);

  // Movement and recording logic
  useFrame(() => {
    let newPosition = [...position];
    let newRotation = [...rotation];

    const forward = new THREE.Vector3(0, 0, -0.04);
    const backward = new THREE.Vector3(0, 0, 0.04);
    const rotationSpeed = 0.05;

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

    if (isRecording) {
      path.current.push({
        position: newPosition,
        rotation: newRotation,
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
    <group ref={group} position={position} rotation={rotation}>
      <primitive object={scene} scale={2} />
    </group>
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


  

/*   const handleModelUpload = (event) => {
    const file = event.target.files[0];  // Get the uploaded file
  
    if (file) {
      console.log("File selected:", file);
  
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const loader = new GLTFLoader();
  
        // Pass the result from FileReader (data URL) to the loader
        loader.load(
          e.target.result,  // Data URL from FileReader
          (gltf) => {
            setSelectedCharacter(gltf);  // Set the loaded model to state
          },
          undefined,  // Optional progress callback
          (error) => {
            console.error("Error loading model:", error);  // Handle error
          }
        );
      };
  
      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  };
   */
  


  const handleCopyPath = () => {
    if (recordedPath.length > 0) {
      // Convert the path into a string (JSON format)
      const pathString = JSON.stringify(recordedPath);

      // Use the Clipboard API to copy the path data
      navigator.clipboard.writeText(pathString).then(() => {
        alert("Recorded path copied to clipboard!");
      }).catch((err) => {
        alert("Failed to copy: " + err);
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

      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={() => setSelectedCharacter(Character1)}>Select Character 1</button>
        <button onClick={() => setSelectedCharacter(Character2)}>Select Character 2</button>
        <input type="file" accept=".glb" /* onChange={handleModelUpload} */ />
        <button onClick={toggleRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button onClick={handleReplay}>Replay</button>
      </div>

      {globalActions && (
        <div style={{ position: "absolute", top: "20%", right: "10px", backgroundColor: "white",width:"15vw", padding: "10px", borderRadius: "5px" }}>
          <h4>Select Animation</h4>
          {Object.keys(globalActions).map((animation) => (
            <button key={animation} onClick={() => setCurrentAnimation(animation)}>
              {animation}
            </button>
          ))}
        </div>
      )}

      {globalActions && (
        <div style={{ position: "absolute", top: "20%", left: "10px", backgroundColor: "white", padding: "10px", borderRadius: "5px" }}>
          <h4>Set Animations for Keys</h4>
          <form>
            {["w", "a", "s", "d"].map((key) => (
              <div key={key}>
                <label>
                  Key "{key.toUpperCase()}":
                  <select
                    value={keyAnimations[key]}
                    onChange={(e) => handleAnimationChange(key, e.target.value)}
                  >
                    {Object.keys(globalActions).map((animation) => (
                      <option key={animation} value={animation}>
                        {animation}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
          </form>
        </div>
      )}

 <div style={{ position: "absolute", bottom: 10, left: 10 }}>
        <button onClick={handleCopyPath}>Copy Recorded Path</button>
      </div> 
    </div>
  );
};

export default App;
