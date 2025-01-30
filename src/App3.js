/* import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Character from "../src/assets/Character/Character.glb"; // Replace with the correct path
import City from "../src/assets/Hall/city.glb";

const Box = ({ isRecording, setRecordedCameraPath, replayPath, replay, camera }) => {
  const { scene } = useGLTF(Character);
  const { scene: cityScene } = useGLTF(City);

  const cameraPath = useRef([]); // Array to store camera path
  const replayIndex = useRef(0);

  useFrame(() => {
    if (isRecording && camera) {
      // Record camera position, rotation, and zoom
      const cameraState = {
        position: camera.position.clone(),
        rotation: camera.rotation.clone(),
        zoom: camera.zoom,
      };
      cameraPath.current.push(cameraState);
    }

    if (replay && replayPath.length > 0 && camera) {
      if (replayIndex.current < replayPath.length) {
        const { position, rotation, zoom } = replayPath[replayIndex.current];
        camera.position.copy(position);
        camera.rotation.copy(rotation);
        camera.zoom = zoom;
        camera.updateProjectionMatrix(); // Apply zoom changes
        replayIndex.current++;
      }
    }
  });

  useEffect(() => {
    if (!isRecording) {
      setRecordedCameraPath([...cameraPath.current]);
    }
  }, [isRecording, setRecordedCameraPath]);

  return (
    <mesh>
      <primitive object={cityScene} scale={1} />
      <mesh position={[0, 0, 0]}>
        <primitive object={scene} scale={2} rotation={[0, -Math.PI, 0]} />
      </mesh>
    </mesh>
  );
};

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedCameraPath, setRecordedCameraPath] = useState([]);
  const [replay, setReplay] = useState(false);
  const cameraRef = useRef();

  const mouseState = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  const handleMouseDown = (event) => {
    mouseState.current.isDragging = true;
    mouseState.current.lastX = event.clientX;
    mouseState.current.lastY = event.clientY;
  };

  const handleMouseMove = (event) => {
    if (!mouseState.current.isDragging || !cameraRef.current) return;

    const deltaX = event.clientX - mouseState.current.lastX;
    const deltaY = event.clientY - mouseState.current.lastY;

    const rotationSpeed = 0.002; // Sensitivity of the rotation
    cameraRef.current.rotation.y -= deltaX * rotationSpeed;
    cameraRef.current.rotation.x -= deltaY * rotationSpeed;

    cameraRef.current.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, cameraRef.current.rotation.x)
    );

    mouseState.current.lastX = event.clientX;
    mouseState.current.lastY = event.clientY;
  };

  const handleMouseUp = () => {
    mouseState.current.isDragging = false;
  };

  const handleMouseWheel = (event) => {
    if (!cameraRef.current) return;

    const zoomSpeed = 0.1;
    const newZoom = cameraRef.current.zoom - event.deltaY * zoomSpeed * 0.001;
    cameraRef.current.zoom = Math.max(1, Math.min(10, newZoom)); // Limit zoom range
    cameraRef.current.updateProjectionMatrix(); // Update the zoom
  };

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      console.log("Recorded Camera Path:", recordedCameraPath); // Log recorded path
    }
  };

  const handleReplay = () => {
    if (recordedCameraPath.length > 0) {
      setReplay(true);
      setTimeout(() => setReplay(false), recordedCameraPath.length * 16); // Adjust based on frame time
    }
  };

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleMouseWheel}
    >
      <Canvas
        camera={{ position: [0, 1, 5], rotation: [0, Math.PI, 0] }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
      >
        <ambientLight intensity={10} />
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
        <Box
          isRecording={isRecording}
          setRecordedCameraPath={setRecordedCameraPath}
          replayPath={recordedCameraPath}
          replay={replay}
          camera={cameraRef.current}
        />
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={toggleRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button onClick={handleReplay}>Replay Camera</button>
      </div>
    </div>
  );
};

export default App;
 */
/* import React, { useState, useEffect, useRef } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Character from "../src/assets/Character/Character.glb"; // Replace with the correct path
import City from "../src/assets/Hall/city.glb";

const Box = ({ isRecording, setRecordedCameraPath, replayPath, replay, camera }) => {
  const { scene } = useGLTF(Character);
  const { scene: cityScene } = useGLTF(City);

  const cameraPath = useRef([]); // Array to store camera path
  const replayIndex = useRef(0);

  useFrame(() => {
    if (isRecording && camera) {
      // Record camera position, rotation, and zoom
      const cameraState = {
        position: camera.position.clone(),
        rotation: camera.rotation.clone(),
        zoom: camera.zoom,
      };
      cameraPath.current.push(cameraState);
    }

    if (replay && replayPath.length > 0 && camera) {
      if (replayIndex.current < replayPath.length) {
        const { position, rotation, zoom } = replayPath[replayIndex.current];
        camera.position.copy(position);
        camera.rotation.copy(rotation);
        camera.zoom = zoom;
        camera.updateProjectionMatrix(); // Apply zoom changes
        replayIndex.current++;
      }
    }
  });

  useEffect(() => {
    if (!isRecording) {
      setRecordedCameraPath([...cameraPath.current]);
    }
  }, [isRecording, setRecordedCameraPath]);

  return (
    <mesh>
      <primitive object={cityScene} scale={1} />
      <mesh position={[0, 0, 0]}>
        <primitive object={scene} scale={2} rotation={[0, -Math.PI, 0]} />
      </mesh>
    </mesh>
  );
};

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedCameraPath, setRecordedCameraPath] = useState([]);
  const [replay, setReplay] = useState(false);
  const cameraRef = useRef();

  const mouseState = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
  });

  const movementSpeed = 0.1; // Speed of camera movement via arrow keys
  const rotationSpeed = 0.002; // Sensitivity of the rotation via mouse

  // Track the camera position and rotation for keyboard navigation
  const cameraState = useRef({
    position: new THREE.Vector3(0, 1, 5),
    rotation: new THREE.Euler(0, Math.PI, 0),
  });

  // Handle mouse down event
  const handleMouseDown = (event) => {
    mouseState.current.isDragging = true;
    mouseState.current.lastX = event.clientX;
    mouseState.current.lastY = event.clientY;
  };

  // Handle mouse move event
  const handleMouseMove = (event) => {
    if (!mouseState.current.isDragging || !cameraRef.current) return;

    const deltaX = event.clientX - mouseState.current.lastX;
    const deltaY = event.clientY - mouseState.current.lastY;

    // Update camera rotation based on mouse movement
    cameraRef.current.rotation.y -= deltaX * rotationSpeed;
    cameraRef.current.rotation.x -= deltaY * rotationSpeed;

    // Clamp vertical rotation to avoid flipping over
    cameraRef.current.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, cameraRef.current.rotation.x)
    );

    mouseState.current.lastX = event.clientX;
    mouseState.current.lastY = event.clientY;
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    mouseState.current.isDragging = false;
  };

  // Handle mouse wheel event for zooming
  const handleMouseWheel = (event) => {
    if (!cameraRef.current) return;

    const zoomSpeed = 0.1;
    const newZoom = cameraRef.current.zoom - event.deltaY * zoomSpeed * 0.001;
    cameraRef.current.zoom = Math.max(1, Math.min(10, newZoom)); // Limit zoom range
    cameraRef.current.updateProjectionMatrix(); // Update the zoom
  };

  // Handle keyboard events for camera movement
  const handleKeyDown = (event) => {
    if (!cameraRef.current) return;

    const moveStep = movementSpeed;
    switch (event.key) {
      case "ArrowUp":
        cameraRef.current.position.z -= moveStep; // Move camera forward
        break;
      case "ArrowDown":
        cameraRef.current.position.z += moveStep; // Move camera backward
        break;
      case "ArrowLeft":
        cameraRef.current.position.x -= moveStep; // Move camera left
        break;
      case "ArrowRight":
        cameraRef.current.position.x += moveStep; // Move camera right
        break;
      default:
        break;
    }
  };

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      console.log("Recorded Camera Path:", recordedCameraPath); // Log recorded path
    }
  };

  const handleReplay = () => {
    if (recordedCameraPath.length > 0) {
      setReplay(true);
      setTimeout(() => setReplay(false), recordedCameraPath.length * 16); // Adjust based on frame time
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleMouseWheel}
    >
      <Canvas
        camera={{ position: cameraState.current.position, rotation: cameraState.current.rotation }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
      >
        <ambientLight intensity={10} />
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
        <Box
          isRecording={isRecording}
          setRecordedCameraPath={setRecordedCameraPath}
          replayPath={recordedCameraPath}
          replay={replay}
          camera={cameraRef.current}
        />
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={toggleRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button onClick={handleReplay}>Replay Camera</button>
      </div>
    </div>
  );
};

export default App;
 */


/* import React, { useState, useEffect, useRef } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Character from "../src/assets/Character/Character.glb"; // Replace with the correct path
import City from "../src/assets/Hall/city.glb";

const Box = ({ isRecording, setRecordedCameraPath, replayPath, replay, camera }) => {
  const { scene } = useGLTF(Character);
  const { scene: cityScene } = useGLTF(City);

  const cameraPath = useRef([]); // Array to store camera path
  const replayIndex = useRef(0);

  useFrame(() => {
    if (isRecording && camera) {
      // Record camera position, rotation, and zoom
      const cameraState = {
        position: camera.position.clone(),
        rotation: camera.rotation.clone(),
        zoom: camera.zoom,
      };
      cameraPath.current.push(cameraState);
    }

    if (replay && replayPath.length > 0 && camera) {
      if (replayIndex.current < replayPath.length) {
        const { position, rotation, zoom } = replayPath[replayIndex.current];
        camera.position.copy(position);
        camera.rotation.copy(rotation);
        camera.zoom = zoom;
        camera.updateProjectionMatrix(); // Apply zoom changes
        replayIndex.current++;
      }
    }
  });

  useEffect(() => {
    if (!isRecording) {
      setRecordedCameraPath([...cameraPath.current]);
    }
  }, [isRecording, setRecordedCameraPath]);

  return (
    <mesh>
      <primitive object={cityScene} scale={1} />
      <mesh position={[0, 0, 0]}>
        <primitive object={scene} scale={2} rotation={[0, -Math.PI, 0]} />
      </mesh>
    </mesh>
  );
};

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedCameraPath, setRecordedCameraPath] = useState([]);
  const [replay, setReplay] = useState(false);
  const cameraRef = useRef();

  const mouseState = useRef({
    isDragging: false,
    isPanning: false,
    lastX: 0,
    lastY: 0,
  });

  const movementSpeed = 0.1; // Speed of camera movement via arrow keys
  const rotationSpeed = 0.002; // Sensitivity of the rotation via mouse
  const panSpeed = 0.01; // Sensitivity for panning

  // Track the camera position and rotation for keyboard navigation
  const cameraState = useRef({
    position: new THREE.Vector3(0, 1, 5),
    rotation: new THREE.Euler(0, Math.PI, 0),
  });

  // Handle mouse down event
  const handleMouseDown = (event) => {
    if (event.button === 0) {
      mouseState.current.isDragging = true; // Left button for rotation
    } else if (event.button === 2) {
      mouseState.current.isPanning = true; // Right button for panning
    }
    mouseState.current.lastX = event.clientX;
    mouseState.current.lastY = event.clientY;
  };

  // Handle mouse move event
  const handleMouseMove = (event) => {
    if (!cameraRef.current) return;

    if (mouseState.current.isDragging) {
      const deltaX = event.clientX - mouseState.current.lastX;
      const deltaY = event.clientY - mouseState.current.lastY;

      // Update camera rotation based on mouse movement
      cameraRef.current.rotation.y -= deltaX * rotationSpeed;
      cameraRef.current.rotation.x -= deltaY * rotationSpeed;

      // Clamp vertical rotation to avoid flipping over
      cameraRef.current.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, cameraRef.current.rotation.x)
      );
    }

    if (mouseState.current.isPanning) {
      const deltaX = event.clientX - mouseState.current.lastX;
      const deltaY = event.clientY - mouseState.current.lastY;

      // Update camera position for panning
      cameraRef.current.position.x -= deltaX * panSpeed;
      cameraRef.current.position.y += deltaY * panSpeed;
    }

    mouseState.current.lastX = event.clientX;
    mouseState.current.lastY = event.clientY;
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    mouseState.current.isDragging = false;
    mouseState.current.isPanning = false;
  };

  // Handle mouse wheel event for zooming
  const handleMouseWheel = (event) => {
    if (!cameraRef.current) return;

    const zoomSpeed = 0.1;
    const newZoom = cameraRef.current.zoom - event.deltaY * zoomSpeed * 0.001;
    cameraRef.current.zoom = Math.max(1, Math.min(10, newZoom)); // Limit zoom range
    cameraRef.current.updateProjectionMatrix(); // Update the zoom
  };
  const rotationStep = rotationSpeed;
  // Handle keyboard events for camera movement
  const handleKeyDown = (event) => {
    if (!cameraRef.current) return;

    const moveStep = movementSpeed;
    switch (event.key) {
      case "ArrowUp":
        cameraRef.current.position.z -= moveStep; // Move camera forward
        break;
      case "ArrowDown":
        cameraRef.current.position.z += moveStep; // Move camera backward
        break;
      case "ArrowLeft":
        cameraRef.current.position.x -= moveStep; // Move camera left
        break;
      case "ArrowRight":
        cameraRef.current.position.x += moveStep; // Move camera right
        break;
        case "w":
          cameraRef.current.position.y -= moveStep; // Move camera left
          break;
        case "s":
          cameraRef.current.position.y += moveStep; // Move camera right
          break;
          case "a": // Rotate camera left (counter-clockwise)
          cameraRef.current.rotation.y += rotationStep;
          break;
        case "d": // Rotate camera right (clockwise)
          cameraRef.current.rotation.y -= rotationStep;
          break;
      default:
        break;
    }
  };

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      console.log("Recorded Camera Path:", recordedCameraPath); // Log recorded path
    }
  };

  const handleReplay = () => {
    if (recordedCameraPath.length > 0) {
      setReplay(true);
      setTimeout(() => setReplay(false), recordedCameraPath.length * 16); // Adjust based on frame time
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleMouseWheel}
    >
      <Canvas
        camera={{ position: cameraState.current.position, rotation: cameraState.current.rotation }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
      >
        <ambientLight intensity={10} />
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
        <Box
          isRecording={isRecording}
          setRecordedCameraPath={setRecordedCameraPath}
          replayPath={recordedCameraPath}
          replay={replay}
          camera={cameraRef.current}
        />
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={toggleRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button onClick={handleReplay}>Replay Camera</button>
      </div>
    </div>
  );
};

export default App;
 */



import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Character from "../src/assets/Character/Character.glb"; // Replace with the correct path
import City from "../src/assets/Hall/city.glb";

const Box = ({ isRecording, setRecordedCameraPath, replayPath, replay, camera }) => {
  const { scene } = useGLTF(Character);
  const { scene: cityScene } = useGLTF(City);

  const cameraPath = useRef([]); // Array to store camera path
  const replayIndex = useRef(0);

  useFrame(() => {
    if (isRecording && camera) {
      // Record camera position, rotation, and zoom
      const cameraState = {
        position: camera.position.clone(),
        rotation: camera.rotation.clone(),
        zoom: camera.zoom,
      };
      cameraPath.current.push(cameraState);
    }

    if (replay && replayPath.length > 0 && camera) {
      if (replayIndex.current < replayPath.length) {
        const { position, rotation, zoom } = replayPath[replayIndex.current];
        camera.position.copy(position);
        camera.rotation.copy(rotation);
        camera.zoom = zoom;
        camera.updateProjectionMatrix(); // Apply zoom changes
        replayIndex.current++;
      }
    }
  });

  useEffect(() => {
    if (!isRecording) {
      setRecordedCameraPath([...cameraPath.current]);
    }
  }, [isRecording, setRecordedCameraPath]);

  return (
    <mesh>
      <primitive object={cityScene} scale={1} />
      <mesh position={[0, 0, 0]}>
        <primitive object={scene} scale={2} rotation={[0, -Math.PI, 0]} />
      </mesh>
    </mesh>
  );
};

const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedCameraPath, setRecordedCameraPath] = useState([]);
  const [replay, setReplay] = useState(false);
  const cameraRef = useRef();

  const mouseState = useRef({
    isDragging: false,
    isPanning: false,
    lastX: 0,
    lastY: 0,
  });

  const movementSpeed = 0.1; // Speed of camera movement via arrow keys
  const rotationSpeed = 0.002; // Sensitivity of the rotation via mouse
  const panSpeed = 0.01; // Sensitivity for panning

  // Track the camera position and rotation for keyboard navigation
  const cameraState = useRef({
    position: new THREE.Vector3(0, 1, 5),
    rotation: new THREE.Euler(0, Math.PI, 0),
  });

  const keyState = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  // Handle mouse down event
  const handleMouseDown = (event) => {
    if (event.button === 0) {
      mouseState.current.isDragging = true; // Left button for rotation
    } else if (event.button === 2) {
      mouseState.current.isPanning = true; // Right button for panning
    }
    mouseState.current.lastX = event.clientX;
    mouseState.current.lastY = event.clientY;
  };

  // Handle mouse move event
  const handleMouseMove = (event) => {
    if (!cameraRef.current) return;

    if (mouseState.current.isDragging) {
      const deltaX = event.clientX - mouseState.current.lastX;
      const deltaY = event.clientY - mouseState.current.lastY;

      // Update camera rotation based on mouse movement
      cameraRef.current.rotation.y -= deltaX * rotationSpeed;
      cameraRef.current.rotation.x -= deltaY * rotationSpeed;

      // Clamp vertical rotation to avoid flipping over
      cameraRef.current.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, cameraRef.current.rotation.x)
      );
    }

    if (mouseState.current.isPanning) {
      const deltaX = event.clientX - mouseState.current.lastX;
      const deltaY = event.clientY - mouseState.current.lastY;

      // Update camera position for panning
      cameraRef.current.position.x -= deltaX * panSpeed;
      cameraRef.current.position.y += deltaY * panSpeed;
    }

    mouseState.current.lastX = event.clientX;
    mouseState.current.lastY = event.clientY;
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    mouseState.current.isDragging = false;
    mouseState.current.isPanning = false;
  };

  // Handle mouse wheel event for zooming
  const handleMouseWheel = (event) => {
    if (!cameraRef.current) return;

    const zoomSpeed = 0.5;
    const newZoom = cameraRef.current.zoom - event.deltaY * zoomSpeed * 0.001;
    cameraRef.current.zoom = Math.max(.02, Math.min(1000, newZoom)); // Limit zoom range
    cameraRef.current.updateProjectionMatrix(); // Update the zoom
  };

  // Handle keyboard events for camera movement
  const handleKeyDown = (event) => {
    if (!cameraRef.current) return;

    // Update the key state when a key is pressed
    keyState.current[event.key] = true;

    const moveStep = movementSpeed;
    const rotationStep = rotationSpeed;

    if (keyState.current["ArrowUp"]) {
      cameraRef.current.position.z -= moveStep; // Move camera forward
    }
    if (keyState.current["ArrowDown"]) {
      cameraRef.current.position.z += moveStep; // Move camera backward
    }
    if (keyState.current["ArrowLeft"]) {
      cameraRef.current.position.x -= moveStep; // Move camera left
    }
    if (keyState.current["ArrowRight"]) {
      cameraRef.current.position.x += moveStep; // Move camera right
    }
    if (keyState.current["w"]) {
      cameraRef.current.position.y -= moveStep; // Move camera up
    }
    if (keyState.current["s"]) {
      cameraRef.current.position.y += moveStep; // Move camera down
    }
    if (keyState.current["a"]) {
      cameraRef.current.rotation.y += rotationStep; // Rotate camera left (counter-clockwise)
    }
    if (keyState.current["d"]) {
      cameraRef.current.rotation.y -= rotationStep; // Rotate camera right (clockwise)
    }
  };

  const handleKeyUp = (event) => {
    // Update the key state when a key is released
    keyState.current[event.key] = false;
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      console.log("Recorded Camera Path:", recordedCameraPath); // Log recorded path
    }
  };

  const handleReplay = () => {
    if (recordedCameraPath.length > 0) {
      setReplay(true);
      setTimeout(() => setReplay(false), recordedCameraPath.length * 16); // Adjust based on frame time
    }
  };

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleMouseWheel}
    >
      <Canvas
        camera={{ position: cameraState.current.position, rotation: cameraState.current.rotation }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
      >
        <ambientLight intensity={10} />
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
        <Box
          isRecording={isRecording}
          setRecordedCameraPath={setRecordedCameraPath}
          replayPath={recordedCameraPath}
          replay={replay}
          camera={cameraRef.current}
        />
      </Canvas>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <button onClick={toggleRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button onClick={handleReplay}>Replay Camera</button>
      </div>
    </div>
  );
};

export default App;
