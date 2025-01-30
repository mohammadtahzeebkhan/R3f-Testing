import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { LoaderUtils } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module";

const DragAndDropViewer = () => {
  const [scene, setScene] = useState(null);
  const canvasRef = useRef();

  // Load GLTF model
  const loadModel = (file) => {
    const url = URL.createObjectURL(file);
    const baseURL = LoaderUtils.extractUrlBase(url);
    const manager = new THREE.LoadingManager();
    const dracoLoader = new DRACOLoader(manager).setDecoderPath("/draco/");
    const ktx2Loader = new KTX2Loader(manager).setTranscoderPath("/basis/");
    const blobURLs = [];
    const assetMap = new Map(); // Optional: to handle asset maps.

    manager.setURLModifier((url, path) => {
      const normalizedURL =
        baseURL +
        decodeURI(url)
          .replace(baseURL, "")
          .replace(/^(\.?\/)/, "");
      if (assetMap.has(normalizedURL)) {
        const blob = assetMap.get(normalizedURL);
        const blobURL = URL.createObjectURL(blob);
        blobURLs.push(blobURL);
        return blobURL;
      }
      return (path || "") + url;
    });

    const loader = new GLTFLoader(manager)
      .setDRACOLoader(dracoLoader)
      .setKTX2Loader(ktx2Loader.detectSupport(new THREE.WebGLRenderer()))
      .setMeshoptDecoder(MeshoptDecoder);

    loader.load(
      url,
      (gltf) => {
        const scene = gltf.scene || gltf.scenes[0];
        setScene(scene);
        blobURLs.forEach(URL.revokeObjectURL);
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF:", error);
      }
    );
  };

  // Handle file selection via input
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      loadModel(file);
    }
  };

  // Handle file drop
  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      loadModel(files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        border: "2px dashed #ccc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        accept=".gltf, .glb"
        style={{
          marginBottom: "1rem",
          padding: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onChange={handleFileSelect}
      />
      {scene ? (
        <Canvas ref={canvasRef} camera={{ position: [0, 2, 5], fov: 45 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} />
          <OrbitControls />
          <primitive object={scene} />
        </Canvas>
      ) : (
        <p>Drag and drop a GLTF file or use the browse button to select one.</p>
      )}
    </div>
  );
};

export default DragAndDropViewer;
