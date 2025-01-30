import React, { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Grid } from "@react-three/drei";
import * as THREE from "three";
import Character1 from "../src/assets/BOT_14.glb";
import Character2 from "../src/assets/Character/Character.glb";
import City from "../src/assets/Hall/park_scene_new_c.glb";
import C1 from "../src/assets/Character/AnimatedWoman4.glb";
import { SkeletonUtils } from "three-stdlib";

import { predefinedPath } from "./path1";
import { predefinedPath1 } from "./path2";
import { predefinedPath2 } from "./path";
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
  defaultAnim,
}) => {
  const group = useRef();
  const path = useRef([]);
  const replayIndex = useRef(0);

  const { scene, animations } = useGLTF(characterModel);
  const { scene: cityScene } = useGLTF(City);
  const { actions: characterActions } = useAnimations(animations, group);

  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const keysPressed = useRef(new Set());

  // Pass actions to parent
  useEffect(() => {
    setGlobalActions(characterActions);
  }, [characterActions, setGlobalActions]);

  useEffect(() => {
    if (characterActions && currentAnimation) {
      const action = characterActions[currentAnimation];
      
      if (action) {
        action.reset();
        //action.timeScale = 0.5; // Set speed before playing
        action.fadeIn(0.24).play();
      }
    }
    
    return () => {
      characterActions?.[currentAnimation]?.fadeOut(0.24);
    };
  }, [currentAnimation, characterActions]);

  // Animation logic
/*   useEffect(() => {
    if (characterActions && currentAnimation) {
      const action = characterActions[currentAnimation];
      action?.reset().fadeIn(0.24).play();
      
    }
    return () => {
      characterActions?.[currentAnimation]?.fadeOut(0.24);
    };
  }, [currentAnimation, characterActions]); */

  // Keyboard Events
/*   useEffect(() => {
    const handleKeyDown = (event) => {
      keysPressed.current.add(event.key);
      if (keyAnimations[event.key]) setCurrentAnimation(keyAnimations[event.key]);
    };

    const handleKeyUp = (event) => {
      keysPressed.current.delete(event.key);
      setCurrentAnimation(defaultAnim);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyAnimations, defaultAnim, setCurrentAnimation]);
 */
  // Movement and Recording Logic
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      keysPressed.current.add(event.key);
      // Check for Shift + W for run animation
  
    
      // Set the animation for the currently pressed key if it exists in keyAnimations
      if (keyAnimations[event.key]) {
        setCurrentAnimation(keyAnimations[event.key]);
      }
    };
  
    
    const handleKeyUp = (event) => {
      keysPressed.current.delete(event.key);
  
      // Check if any of the remaining pressed keys are mapped to an animation
      const activeKey = Array.from(keysPressed.current).find((key) => keyAnimations[key]);
      if (activeKey) {
        setCurrentAnimation(keyAnimations[activeKey]); // Set animation to the next active key
      } else {
        setCurrentAnimation(defaultAnim); // No active keys, reset to default animation
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyAnimations, defaultAnim, setCurrentAnimation]);
  
  useFrame(() => {
    let newPosition = [...position];
    let newRotation = [...rotation];
    const forward = new THREE.Vector3(0, 0, -0.01);
    const backward = new THREE.Vector3(0, 0, 0.01);
    const run = new THREE.Vector3(0, 0, 0.02);
    const rotationSpeed = 0.008;

    if (keysPressed.current.has("s")) {
      forward.applyEuler(new THREE.Euler(0, newRotation[1], 0));
      newPosition = [newPosition[0] + forward.x, newPosition[1], newPosition[2] + forward.z];
     
    }
    if (keysPressed.current.has("r")) {
      setCurrentAnimation("CharacterArmature|Run");
      run.applyEuler(new THREE.Euler(0, newRotation[1], 0));
      newPosition = [newPosition[0] + backward.x, newPosition[1], newPosition[2] + backward.z];
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
        position: newPosition.map((val) => parseFloat(val.toFixed(3))),
        rotation: newRotation.map((val) => parseFloat(val.toFixed(3))),
        animation: currentAnimation,
      });
    }
  });

  useEffect(() => {
    if (!isRecording) {
      setRecordedPath([...path.current]);
    }
  }, [isRecording, setRecordedPath]);

  // Replay Logic
  useFrame(() => {
    if (replay && replayIndex.current < replayPath.length) {
      const { position, rotation, animation } = replayPath[replayIndex.current];
      setPosition(position);
      setRotation(rotation);
      setCurrentAnimation(animation);
      replayIndex.current++;
    }
  });

  return (
    <>
      <primitive object={cityScene} scale={1} />
      <group ref={group} position={position} rotation={rotation}>
        <primitive object={scene} scale={.1} />
      </group>
    </>
  );
};

const Character = ({ predefinedPath, replay, index, modelPath }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(C1); // Load the correct model based on the modelPath
  const { actions } = useAnimations(animations, group);

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]); // Clone the model

  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]); // Store rotation as Euler angles
  const [currentAnimation, setCurrentAnimation] = useState("CharacterArmature|Idle");

  // Replay predefined path for each character
  useFrame(() => {
    if (replay && replay.current[index] < predefinedPath.length) {
      const { position: newPosition, rotation: newRotation, animation } = predefinedPath[replay.current[index]];
      setPosition(newPosition);
      setRotation(newRotation);
      setCurrentAnimation(animation);
      replay.current[index]++;
    } else if (replay) {
      replay.current[index] = 0; // Reset replay index after completion for each character
    }
  });

  // Handle animation playback
  useEffect(() => {
    if (actions[currentAnimation]) {
      actions[currentAnimation].reset().fadeIn(0.24).play();
      
    }
    return () => actions?.[currentAnimation]?.fadeOut(0.24);
  }, [currentAnimation, actions]);

  return (
    <group ref={group} position={position} rotation={rotation}>
      {/* Render cloned character model */}
      <primitive object={clone} scale={1} />
    </group>
  );
};



const App = () => {

  const [isReplaying, setIsReplaying] = useState(false);
  const replayIndex = useRef([0, 0]);  // Track replay index for both characters

  // Start replaying on mount
  useEffect(() => {
    replayIndex.current = [0, 0];  // Reset the replay index for both characters
    setIsReplaying(true);
  }, []);

  // Handle replay trigger
  const handleReplay1 = () => {
    replayIndex.current = [0, 0];  // Reset replay index for both characters
    setIsReplaying(true);
    setTimeout(() => setIsReplaying(false), Math.max(predefinedPath.length, predefinedPath1.length) * 10000); // Adjust timing based on the longer path
  };


  const [defaultAnim, setDefaultAnim] = useState("CharacterArmature|Idle");
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentAnimation, setCurrentAnimation] = useState(defaultAnim);
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

  const handleReplay = () => {
    if (recordedPath.length > 0) {
      setReplay(true);
      setTimeout(() => setReplay(false), recordedPath.length * 100);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedCharacter(URL.createObjectURL(file));
    }
  };

  const handleCopyPath = () => {
    if (recordedPath.length > 0) {
      navigator.clipboard.writeText(JSON.stringify(recordedPath, null, 2)).then(() => {
        alert("Recorded path copied to clipboard!");
      });
    } else {
      alert("No recorded path to copy!");
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={4} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Grid infiniteGrid cellSize={1} sectionSize={10} fadeDistance={30} />
        <Character predefinedPath={predefinedPath} replay={isReplaying ? replayIndex : null} index={0}/>

{/* Second character following path 2 */}
 <Character predefinedPath={predefinedPath1} replay={isReplaying ? replayIndex : null} index={1} />
 <Character predefinedPath={predefinedPath2} replay={isReplaying ? replayIndex : null} index={2}  />
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
            defaultAnim={defaultAnim}
          />
        )}
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={() => setSelectedCharacter(Character1)}>Select Character 1</button>
        <button onClick={() => setSelectedCharacter(Character2)}>Select Character 2</button>
        <input type="file" accept=".glb" onChange={handleFileSelect} />
        <button onClick={() => setIsRecording(!isRecording)}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button onClick={handleReplay}>Replay</button>
        <button onClick={handleCopyPath}>Copy Recorded Path</button>
      </div>
      {globalActions && (
        <div style={{ position: "absolute", top: "20%", left: 10, background: "white", padding: 10 }}>
          <h4>Set Animations</h4>
          <form>
            {["w", "a", "s", "d"].map((key) => (
              <div key={key}>
                <label>
                  Key "{key.toUpperCase()}":
                  <select value={keyAnimations[key]} onChange={(e) => handleAnimationChange(key, e.target.value)}>
                    {Object.keys(globalActions).map((animation) => (
                      <option key={animation} value={animation}>
                        {animation}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
            <div>
              <label>
                Default Animation:
                <select value={defaultAnim} onChange={(e) => setDefaultAnim(e.target.value)}>
                  {Object.keys(globalActions).map((animation) => (
                    <option key={animation} value={animation}>
                      {animation}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </form>
        </div>
      )}
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
      <div style={{ position: "absolute", bottom: 10, left: 10 }}>
  <button onClick={handleCopyPath}>Copy Recorded Path</button>
</div>

    </div>
  );
};

export default App;
