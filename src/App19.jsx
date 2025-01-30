/* import React, { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Box, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";

const Player = ({ position }) => {
  const [bullets, setBullets] = useState([]);

  const shoot = () => {
    setBullets((bullets) => [
      ...bullets,
      { id: Math.random(), position: [0, 0, 0] },
    ]);
  };

  return (
    <>
      <RigidBody colliders="cuboid" position={position} onClick={shoot}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet.position} />
      ))}
    </>
  );
};

const Bullet = ({ position }) => {
  return (
    <RigidBody colliders="cuboid" mass={0.2} position={position}>
      <Box args={[0.2, 0.2, 0.2]}>
        <meshStandardMaterial color="red" />
      </Box>
    </RigidBody>
  );
};

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
      <Box args={[10, 0.5, 10]}>
        <meshStandardMaterial color="green" />
      </Box>
    </RigidBody>
  );
};

export default function ShooterGame() {
  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Physics debug={true}>
        <Ground />
        <Player position={[0, 2, 0]} />
      </Physics>
    </Canvas>
  );
}
 */




/* import React, { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Box, OrbitControls } from "@react-three/drei";

const Player = ({ position }) => {
  const [bullets, setBullets] = useState([]);
  const ref = useRef();

  const shoot = () => {
    if (!ref.current) return;
    const playerPosition = ref.current.translation();
    setBullets((bullets) => [
      ...bullets,
      { id: Math.random(), position: [playerPosition.x, playerPosition.y, playerPosition.z] },
    ]);
  };

  return (
    <>
      <RigidBody ref={ref} colliders="cuboid" position={position} onClick={shoot}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet.position} />
      ))}
    </>
  );
};

const Bullet = ({ position }) => {
  return (
    <RigidBody colliders="cuboid" mass={0.2} position={position}>
      <Box args={[0.2, 0.2, 0.2]}>
        <meshStandardMaterial color="red" />
      </Box>
    </RigidBody>
  );
};

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
      <Box args={[10, 0.5, 10]}>
        <meshStandardMaterial color="green" />
      </Box>
    </RigidBody>
  );
};

export default function ShooterGame() {
  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Physics debug={true}>
        <Ground />
        <Player position={[0, 2, 0]} />
      </Physics>
    </Canvas>
  );
}

 */



/* 
import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Box, OrbitControls } from "@react-three/drei";

const Player = ({ position }) => {
  const [bullets, setBullets] = useState([]);
  const ref = useRef();

  const shoot = () => {
    if (!ref.current) return;
    const playerPosition = ref.current.translation();
    const direction = [0, 0, -1]; // Adjust the shooting direction as needed
    setBullets((bullets) => [
      ...bullets,
      { id: Math.random(), position: [playerPosition.x, playerPosition.y, playerPosition.z], direction },
    ]);
  };

  return (
    <>
      <RigidBody ref={ref} colliders="cuboid" position={position} onClick={shoot}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet.position} direction={bullet.direction} />
      ))}
    </>
  );
};

const Bullet = ({ position, direction }) => {
  const bulletRef = useRef();

  useEffect(() => {
    if (bulletRef.current) {
      bulletRef.current.applyImpulse(
        { x: direction[0] * 5, y: direction[1] * 5, z: direction[2] * 5 },
        true
      );
    }
  }, []);

  return (
    <RigidBody ref={bulletRef} colliders="cuboid" mass={0.2} position={position}>
      <Box args={[0.2, 0.2, 0.2]}>
        <meshStandardMaterial color="red" />
      </Box>
    </RigidBody>
  );
};

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
      <Box args={[10, 0.5, 10]}>
        <meshStandardMaterial color="green" />
      </Box>
    </RigidBody>
  );
};

export default function ShooterGame() {
  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Physics debug={true}>
        <Ground />
        <Player position={[0, 2, 0]} />
      </Physics>
    </Canvas>
  );
}
 */

/* import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Box, OrbitControls } from "@react-three/drei";

const Player = ({ position }) => {
  const [bullets, setBullets] = useState([]);
  const ref = useRef();

  const shoot = () => {
    if (!ref.current) return;

    const playerPosition = ref.current.translation();

    setBullets((bullets) => [
      ...bullets,
      {
        id: Math.random(),
        position: [playerPosition.x, playerPosition.y, playerPosition.z],
      },
    ]);
  };

  return (
    <>
      <RigidBody ref={ref} colliders="cuboid" position={position} onClick={shoot}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet.position} />
      ))}
    </>
  );
};

const Bullet = ({ position }) => {
  const bulletRef = useRef();

  useEffect(() => {
    if (bulletRef.current) {
      bulletRef.current.applyImpulse({ x: 0, y: 0, z: -5 }, true); // Always moves forward in Z direction
    }
  }, []);

  return (
    <RigidBody ref={bulletRef} colliders="cuboid" mass={0.2} position={position}>
      <Box args={[0.2, 0.2, 0.2]}>
        <meshStandardMaterial color="red" />
      </Box>
    </RigidBody>
  );
};

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
      <Box args={[10, 0.5, 10]}>
        <meshStandardMaterial color="green" />
      </Box>
    </RigidBody>
  );
};

export default function ShooterGame() {
  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Physics debug={true}>
        <Ground />
        <Player position={[0, 2, 0]} />
      </Physics>
    </Canvas>
  );
}
 */

/* 
import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Box, OrbitControls } from "@react-three/drei";

const Player = ({ position }) => {
  const [bullets, setBullets] = useState([]);
  const ref = useRef();

  const shoot = () => {
    if (!ref.current) return;

    const playerPosition = ref.current.translation();

    setBullets((bullets) => [
      ...bullets,
      {
        id: Math.random(),
        position: [playerPosition.x, playerPosition.y, playerPosition.z],
      },
    ]);
  };

  return (
    <>
      <RigidBody ref={ref} colliders="cuboid" position={position} onClick={shoot}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet.position} />
      ))}
    </>
  );
};

const Bullet = ({ position }) => {
  const bulletRef = useRef();

  useEffect(() => {
    if (bulletRef.current) {
      // Apply impulse in a SINGLE direction (negative Z-axis)
      bulletRef.current.applyImpulse({ x: 0, y: 0, z: -5 }, true);
    }
  }, []);

  return (
    <RigidBody ref={bulletRef} colliders="cuboid" mass={0.2} position={position} gravityScale={0}>
      <Box args={[0.2, 0.2, 0.2]}>
        <meshStandardMaterial color="red" />
      </Box>
    </RigidBody>
  );
};

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
      <Box args={[10, 0.5, 10]}>
        <meshStandardMaterial color="green" />
      </Box>
    </RigidBody>
  );
};

export default function ShooterGame() {
  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Physics debug={true}>
        <Ground />
        <Player position={[0, 2, 0]} />
      </Physics>
    </Canvas>
  );
}
 */

/* import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Box, OrbitControls } from "@react-three/drei";

const Player = ({ position }) => {
  const [bullets, setBullets] = useState([]);
  const ref = useRef();

  const shoot = () => {
    if (!ref.current) return;

    const playerPosition = ref.current.translation();

    setBullets((bullets) => [
      ...bullets,
      {
        id: Math.random(),
        position: [playerPosition.x, playerPosition.y, playerPosition.z],
      },
    ]);
  };

  return (
    <>
      <RigidBody ref={ref} colliders="cuboid" position={position} onClick={shoot}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet.position} />
      ))}
    </>
  );
};

const Bullet = ({ position }) => {
  const bulletRef = useRef();

  useEffect(() => {
    if (bulletRef.current) {
      bulletRef.current.applyImpulse({ x: 0, y: 0, z: -2 }, true); // Reduced speed
      bulletRef.current.setLinearDamping(0.3); // Smooth deceleration
    }
  }, []);

  return (
    <RigidBody
      ref={bulletRef}
      colliders="cuboid"
      mass={0.2}
      position={position}
      gravityScale={0}
    >
      <Box args={[0.2, 0.2, 0.2]}>
        <meshStandardMaterial color="red" />
      </Box>
    </RigidBody>
  );
};

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
      <Box args={[10, 0.5, 10]}>
        <meshStandardMaterial color="green" />
      </Box>
    </RigidBody>
  );
};

export default function ShooterGame() {
  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Physics debug={true}>
        <Ground />
        <Player position={[0, 2, 0]} />
      </Physics>
    </Canvas>
  );
}

 */



/* import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Box, OrbitControls } from "@react-three/drei";

const Player = ({ position }) => {
  const [bullets, setBullets] = useState([]);
  const ref = useRef();

  const shoot = () => {
    if (!ref.current) return;

    const playerPosition = ref.current.translation();

    setBullets((bullets) => [
      ...bullets,
      {
        id: Math.random(),
        position: [playerPosition.x, playerPosition.y, playerPosition.z],
      },
    ]);
  };

  return (
    <>
      <RigidBody ref={ref} colliders="cuboid" position={position} onClick={shoot}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet.position} />
      ))}
    </>
  );
};

const Bullet = ({ position }) => {
  const bulletRef = useRef();

  useEffect(() => {
    if (bulletRef.current) {
      bulletRef.current.applyImpulse({ x: 0, y: 0, z: -2 }, true); // Initial small impulse
      bulletRef.current.setLinearDamping(0.1); // Prevent infinite acceleration
    }
  }, []);

  useFrame(() => {
    if (bulletRef.current) {
      bulletRef.current.applyImpulse({ x: 0, y: 0, z: -0.1 }, true); // Continuous small impulse
    }
  });

  return (
    <RigidBody
      ref={bulletRef}
      colliders="cuboid"
      mass={0.2}
      position={position}
      gravityScale={0}
    >
      <Box args={[0.2, 0.2, 0.2]}>
        <meshStandardMaterial color="red" />
      </Box>
    </RigidBody>
  );
};

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
      <Box args={[100, 0.5, 100]}>
        <meshStandardMaterial color="green" />
      </Box>
    </RigidBody>
  );
};

export default function ShooterGame() {
  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls />
      <ambientLight intensity={2} />
      <pointLight position={[10, 10, 10]} />
      <Physics debug={true}>
        <Ground />
        <Player position={[0, 2, 0]} />
      </Physics>
    </Canvas>
  );
}
 */


/* import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Box, OrbitControls } from "@react-three/drei";

const Player = ({ position }) => {
  const [bullets, setBullets] = useState([]);
  const ref = useRef();

  const shoot = () => {
    if (!ref.current) return;

    const playerPosition = ref.current.translation();

    setBullets((bullets) => [
      ...bullets,
      {
        id: Math.random(),
        position: [playerPosition.x, playerPosition.y, playerPosition.z],
      },
    ]);
  };

  return (
    <>
      <RigidBody ref={ref} colliders="cuboid" position={position} onClick={shoot}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet.position} />
      ))}
    </>
  );
};

const Bullet = ({ position }) => {
  const bulletRef = useRef();

  useFrame(() => {
    if (bulletRef.current) {
      bulletRef.current.applyImpulse({ x: 0, y: 0, z: -0.1 }, true); // Continuous small impulse
    }
  });

  return (
    <RigidBody
      ref={bulletRef}
      colliders="cuboid"
      mass={0.2}
      position={position}
      gravityScale={0}
      onCollisionEnter={(event) => {
        console.log("Bullet hit:", event.rigidBodyObject);
      }}
    >
      <Box args={[0.2, 0.2, 0.2]}>
        <meshStandardMaterial color="red" />
      </Box>
    </RigidBody>
  );
};

const Target = ({ position }) => {
  return (
    <RigidBody colliders="cuboid" mass={1} position={position}>
      <Box args={[.5, 5, 1]}>
        <meshStandardMaterial color="yellow" />
      </Box>
    </RigidBody>
  );
};

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
      <Box args={[100, 0.5, 100]}>
        <meshStandardMaterial color="green" />
      </Box>
    </RigidBody>
  );
};

const generateTargets = (count) => {
  return Array.from({ length: count }, () => ({
    id: Math.random(),
    position: [
      (Math.random() - 0.5) * 50, // X: Random between -25 to 25
      Math.random() * 5 + 1, // Y: Random between 1 to 6
      (Math.random() - 0.5) * -50 // Z: Random between -25 to -50
    ],
  }));
};

export default function ShooterGame() {
  const targets = generateTargets(50);
  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls />
      <ambientLight intensity={5} />
      <pointLight position={[10, 10, 10]} />
      <Physics debug={true}>
        <Ground />
        <Player position={[0, 2, 0]} />
        {targets.map((target) => (
          <Target key={target.id} position={target.position} />
        ))}
      </Physics>
    </Canvas>
  );
}
 */


/* import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Box, OrbitControls } from "@react-three/drei";

const Player = ({ position }) => {
  const [bullets, setBullets] = useState([]);
  const ref = useRef();

  const shoot = () => {
    if (!ref.current) return;
    const playerPosition = ref.current.translation();
    setBullets((bullets) => [
      ...bullets,
      {
        id: Math.random(),
        position: [playerPosition.x, playerPosition.y, playerPosition.z],
      },
    ]);
  };

  return (
    <>
      <RigidBody ref={ref} colliders="cuboid" position={position} onClick={shoot}>
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet.position} />
      ))}
    </>
  );
};

const Bullet = ({ position }) => {
  const bulletRef = useRef();

   useFrame(() => {
    if (bulletRef.current) {
      bulletRef.current.applyImpulse({ x: 0, y: 0, z: -0.1 }, true); // Continuous small impulse
    }
  });

  return (
    <RigidBody
      ref={bulletRef}
      colliders="cuboid"
      mass={0.2}
      position={position}
      gravityScale={0}
    >
      <Box args={[0.2, 0.2, 0.2]}>
        <meshStandardMaterial color="red" />
      </Box>
    </RigidBody>
  );
};

const Target = ({ position, onHit }) => {
  const targetRef = useRef();
  const [hit, setHit] = useState(false);

  useEffect(() => {
    if (targetRef.current) {
      // Correct way to assign userData in Rapier
      targetRef.current.userData = { onHit: () => setHit(true) };
    }
  }, []);

  return (
    <RigidBody ref={targetRef} colliders="cuboid"  position={position}>
      <Box args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color={hit ? "yellow" : "purple"} />
      </Box>
    </RigidBody>
  );
};

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
      <Box args={[100, 0.5, 100]}>
        <meshStandardMaterial color="green" />
      </Box>
    </RigidBody>
  );
};

const generateTargets = (count) => {
  return Array.from({ length: count }, () => ({
    id: Math.random(),
    position: [
      Math.random() * 20 - 10,
      Math.random() * 5 + 1,
      Math.random() * -20,
    ],
  }));
};

export default function ShooterGame() {
  const targets = generateTargets(50);

  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls />
      <ambientLight intensity={5} />
      <pointLight position={[10, 10, 10]} />
      <Physics debug={true}>
        <Ground />
        <Player position={[0, 2, 0]} />
        {targets.map((target) => (
          <Target key={target.id}   />
        ))}
      </Physics>
    </Canvas>
  );
}

 */


import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Box, OrbitControls } from "@react-three/drei";

// Player component with rotation and shooting functionality
const Player = ({ position }) => {
  const [bullets, setBullets] = useState([]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const ref = useRef();

  // Function to handle shooting
  const shoot = () => {
    if (!ref.current) return;

    const playerPosition = ref.current.translation();
    setBullets((bullets) => [
      ...bullets,
      {
        id: Math.random(),
        position: [playerPosition.x, playerPosition.y, playerPosition.z],
      },
    ]);
  };

  // Use effect to handle keyboard events for rotation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const rotationSpeed = 0.1;

      switch (e.key) {
        case 'w':
          setRotation((prevRotation) => [prevRotation[0] - rotationSpeed, prevRotation[1], prevRotation[2]]);
          break;
        case 's':
          setRotation((prevRotation) => [prevRotation[0] + rotationSpeed, prevRotation[1], prevRotation[2]]);
          break;
        case 'a':
          setRotation((prevRotation) => [prevRotation[0], prevRotation[1] - rotationSpeed, prevRotation[2]]);
          break;
        case 'd':
          setRotation((prevRotation) => [prevRotation[0], prevRotation[1] + rotationSpeed, prevRotation[2]]);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  return (
    <>
      <RigidBody ref={ref} colliders="cuboid" position={position} onClick={shoot}>
        <Box args={[1, 1, 1]} rotation={rotation}>
          <meshStandardMaterial color="blue" />
        </Box>
      </RigidBody>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} position={bullet.position} />
      ))}
    </>
  );
};

// Bullet component to handle movement and collision detection
const Bullet = ({ position }) => {
  const bulletRef = useRef();

  useFrame(() => {
    if (bulletRef.current) {
      bulletRef.current.applyImpulse({ x: 0, y: 0, z: 1 }, true); // Continuous small impulse
    }
  });
  return (
    <RigidBody ref={bulletRef} colliders="cuboid" mass={0.2} position={position} gravityScale={0}>
      <Box args={[0.2, 0.2, 0.2]}>
        <meshStandardMaterial color="red" />
      </Box>
    </RigidBody>
  );
};

const generateTargets = (count) => {
  return Array.from({ length: count }, () => ({
    id: Math.random(),
    position: [
      Math.random() * 20 - 10,
      Math.random() * 5 + 1,
      Math.random() * 20,
    ],
  }));
};

// Target component to change color on hit
const Target = ({ position }) => {
  const [color, setColor] = useState("green");
  const targetRef = useRef();

  // Handle collision detection
  const onHit = (e) => {
    if (e.colliderObject && e.colliderObject.userData?.isBullet) {
      setColor("yellow"); // Change color on hit
    }
  };

  return (
    <RigidBody ref={targetRef} colliders="cuboid" position={position} onCollisionEnter={onHit}>
      <Box args={[1, 1, 1]}>
        <meshStandardMaterial color={color} />
      </Box>
    </RigidBody>
  );
};
 
// Ground component
const Ground = () => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -2, 0]}>
      <Box args={[100, 0.5, 100]}>
        <meshStandardMaterial color="gray" />
      </Box>
    </RigidBody>
  );
};

// Main Game component
export default function ShooterGame() {
  const targets = generateTargets(50); // Generate 50 random targets

  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls />
      <ambientLight intensity={5} />
      <pointLight position={[10, 10, 10]} />
      <Physics debug={true}>
        <Ground />
        <Player position={[0, 2, 0]} />
        {targets.map((target) => (
          <Target key={target.id} position={target.position} />
        ))}
      </Physics>
    </Canvas>
  );
}
