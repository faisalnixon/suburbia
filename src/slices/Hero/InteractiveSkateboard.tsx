"use client";
import * as THREE from "three";
import { Skateboard } from "@/components/Skateboard";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  Center,
  Html,
} from "@react-three/drei";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Hotspot } from "./Hotspot";
import gsap from "gsap";
import { WavyPaths } from "./WavyPaths";

const INITIAL_CAMERA_POSITION = [1.5, 1, 1.4] as const;

type Props = {
  deckTextureURL: string;
  wheelTextureURL: string;
  truckColor: string;
  boltColor: string;
};

export function InteractiveSkateboard({
  deckTextureURL,
  wheelTextureURL,
  truckColor,
  boltColor,
}: Props) {
  return (
    <div className="parent absolute inset-0 z-10 flex items-center justify-center w-full top-[-450px]">
      <Canvas
        className="min-h-[60rem] w-[100%] "
        camera={{ position: INITIAL_CAMERA_POSITION, fov: 55 }}
        // camera={{ position: [1.5, 1, 1.4], fov: 55 }}
      >
        <Suspense>
          <Scene
            deckTextureURL={deckTextureURL}
            wheelTextureURL={wheelTextureURL}
            truckColor={truckColor}
            boltColor={boltColor}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Scene({
  deckTextureURL,
  wheelTextureURL,
  truckColor,
  boltColor,
}: Props) {
  const containerRef = useRef<THREE.Group>(null);
  const originRef = useRef<THREE.Group>(null);

  const [animating, setAnimating] = useState(false);
  const [showHotspot, setShowHotspot] = useState({
    front: true,
    middle: true,
    back: true,
  });

  useEffect(() => {
    if(!containerRef.current || !originRef.current) return;

    gsap.to(containerRef.current.position, {
      x:0.2,
      duration:3,
      repeat:-1,
      yoyo:true,
      ease:"sine.inOut"
    })

    gsap.to(originRef.current.rotation, {
      y:Math.PI/64,
      duration:3,
      repeat:-1,
      yoyo:true,
      ease:"sine.inOut"
    })
  }, []);

  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(new THREE.Vector3(-0.2, 0.15, 0));

    // setZoom()
    // window.addEventListener("resize", setZoom)
    // function setZoom (){
    // const scale = Math.max(Math.min(1000 / window.innerHeight, 2.2) , 1)
    // camera.position.x = INITIAL_CAMERA_POSITION[0] * scale
    // camera.position.y = INITIAL_CAMERA_POSITION[1] * scale
    // camera.position.z = INITIAL_CAMERA_POSITION[2] * scale
    // }
    // return () => window.removeEventListener("resize" , setZoom)

    function updateCamera() {
      let scale = 1;

      if (window.innerWidth < 600) {
        scale = 4; // one-fourth of screen
      } else if (window.innerWidth < 1000) {
        scale = 3; // one-third of screen
      } else {
        scale = 2; // default size
      }

      camera.position.set(
        INITIAL_CAMERA_POSITION[0] * scale,
        INITIAL_CAMERA_POSITION[1] * scale,
        INITIAL_CAMERA_POSITION[2] * scale
      );

      camera.updateProjectionMatrix(); // projection matrix means how 3D points are projected onto the 2D screen.
      //updateProjectionMatrix makes sure the camera's projection matrix is recalculated after changing its properties, ensuring the 3D scene is rendered correctly from the new perspective.
    }
    updateCamera();
    window.addEventListener("resize", updateCamera);
    return () => window.removeEventListener("resize", updateCamera);
  }, [camera]);

  function onClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();//event.stopPropagation() doesn’t just stop the event from bubbling up the DOM tree; it also prevents any other event listeners on the same element from being triggered. This is particularly useful when you want to ensure that only one specific handler responds to an event, avoiding potential conflicts or unintended behaviors from multiple listeners.

    const board = containerRef.current;
    const origin = originRef.current;

    if (!board || !origin || animating) return;
    // if (!board || !origin) return;

    const { name } = event.object;

    setShowHotspot((current) => ({ ...current, [name]: false }));

    if (name === "back") {
      ollie(board);
    } else if (name === "middle") {
      kickflip(board);
    } else if (name === "front") {
      frontside360(board, origin);
    }

    function ollie(board: THREE.Group) {
      jumpBoard(board);

      gsap
        .timeline()
        .to(board.rotation, { x: -0.6, duration: 0.26, ease: "none" })
        .to(board.rotation, { x: 0.4, duration: 0.82, ease: "power2.in" })
        .to(board.rotation, { x: 0, duration: 0.12, ease: "none" });
    }

    function kickflip(board: THREE.Group) {
      jumpBoard(board);

      gsap
        .timeline()
        .to(board.rotation, { x: -0.6, duration: 0.26, ease: "none" })
        .to(board.rotation, { x: 0.4, duration: 0.82, ease: "power2.in" })
        .to(
          board.rotation,
          {
            z: `+=${Math.PI * 2}`,
            duration: 0.78,
            ease: "none",
          },
          0.3
        )
        .to(board.rotation, { x: 0, duration: 0.12, ease: "none" });
    }

    function frontside360(board: THREE.Group, origin: THREE.Group) {
      jumpBoard(board);

      gsap
        .timeline()
        .to(board.rotation, { x: -0.6, duration: 0.26, ease: "none" })
        .to(board.rotation, { x: 0.4, duration: 0.82, ease: "power2.in" })
        .to(
          board.rotation,
          {
            y: `+=${Math.PI * 2}`,
            duration: 0.77,
            ease: "none",
          },
          0.3
        )
        .to(board.rotation, { x: 0, duration: 0.14, ease: "none" });
    }

    function jumpBoard(board: THREE.Group) {
      setAnimating(true);

      gsap
        .timeline({ onComplete: () => setAnimating(false) })
        .to(board.position, {
          y: 0.8,
          duration: 0.51,
          ease: "power2.out",
          delay: 0.26,
        })
        .to(board.position, {
          y: 0,
          duration: 0.43,
          ease: "power2.in",
        });
    }
  }
  return (
    <group>
      {/* <OrbitControls /> */}
      <Environment files={"/hdr/warehouse-256.hdr"} />
      <Center> 
        {/* // Center is a helper component from @react-three/drei that automatically centers its children within the scene. It calculates the bounding box of the child objects and adjusts their position so that they are centered around the origin (0, 0, 0) in the 3D space. This is particularly useful for ensuring that models or groups of objects are properly aligned and visually balanced within the scene without having to manually adjust their positions. */}
        <group ref={originRef}>
          <group ref={containerRef} position={[-0.25, 0, -0.635]}>
            <group position={[0, -0.086, 0.635]}>
              <Skateboard
                wheelTextureURLs={[wheelTextureURL]}
                wheelTextureURL={wheelTextureURL}
                deckTextureURLs={[deckTextureURL]}
                deckTextureURL={deckTextureURL}
                truckColor={truckColor}
                boltColor={boltColor}
                constantWheelSpin
              />

              <Hotspot
                isVisible={!animating && showHotspot.front}
                position={[0, 0.38, 1]}
                color="#b8fc39"
              />
              <mesh position={[0, 0.27, 0.9]} name="front" onClick={onClick}>
                <boxGeometry args={[0.6, 0.2, 0.58]} />
                <meshStandardMaterial visible={false} />
              </mesh>

              <Hotspot
                isVisible={!animating && showHotspot.middle}
                position={[0, 0.33, 0]}
                color="#FF7a51"
              />
              <mesh position={[0, 0.27, 0]} name="middle" onClick={onClick}>
                <boxGeometry args={[0.6, 0.1, 1.2]} />
                {/* <boxGeometry args={[0.6, 0.1, 2.2]} /> */}
                <meshStandardMaterial visible={false} />
              </mesh>

              <Hotspot
                isVisible={!animating && showHotspot.back}
                position={[0, 0.35, -0.9]}
                color="#46acfa"
              />
              <mesh position={[0, 0.27, -0.9]} name="back" onClick={onClick}>
                <boxGeometry args={[0.6, 0.2, 0.58]} />
                <meshStandardMaterial visible={false} />
              </mesh>
            </group>
          </group>
        </group>
      </Center>
      <ContactShadows opacity={0.6} position={[0, -0.8, 0]} />

      <group
        rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
        position={[0, -0.9, -0.5]}
        scale={[0.2, 0.2, 0.2]}
      >
        <Html wrapperClass="pointer-events-none" transform zIndexRange={[1,0]} occlude="blending">
          <WavyPaths/>
        </Html>
      </group>
    </group>
  );
}



























// Canvas,Suspense ,Suspense
// "use client";

// import { Canvas } from "@react-three/fiber";
// import React, { Suspense } from "react";

// type Props = {};

// export default function InteractiveSkateboard({}: Props) {
//   return (
//     <div className="absolute inset-0 z-10 flex items-center justify-center">
//       <Canvas className="min-h-[60rem] w-full">
//         {/* The <Canvas> from React Three Fiber isn’t just a plain HTML <canvas>.
//         It already comes with useful features built in — like a camera you can customize, scene setup, and other essentials. If you were using raw Three.js, you’d have to manually create the camera, add it to the scene, and handle all the boilerplate yourself.
//         React Three Fiber makes this process much simpler by setting up those basics for you automatically. */}
//         <Suspense>
//           {/* React Suspense is a feature that helps us handle loading states in a smooth way.
//             For example, when we’re loading heavy assets like the 3D skateboard model and its textures, it might take a moment before they’re ready.
//             Instead of showing a blank screen or breaking the app, Suspense lets us show a fallback (like a spinner, text, or simple placeholder) until everything is fully loaded.
//             This makes the user experience much nicer, since people see something right away while the actual content is being prepared. */}
//             <Scene/>
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }

// // React Three Fiber Hooks
// // React Three Fiber gives us special hooks (like useFrame, useThree, etc.) that help control things inside the 3D scene.

// // ⚠️ But there’s one important rule: these hooks only work inside the <Canvas> component.
// // If you try to call them outside of Canvas (for example, directly in your page code), React will throw an error because the 3D context doesn’t exist there.

// // ✅ To use these hooks correctly, we create a new function (a React component) inside the Canvas. That way, the hook runs inside the 3D environment where it has access to the scene, camera, and other Three.js features.

// // 👉 In short: Hooks like useFrame only work inside <Canvas>. To use them, wrap your logic inside a new component (like Scene) and render that inside the Canvas.

// function Scene() {
//   return (
//     <Suspense>
//       {/* Grouping Elements in React Three Fiber
//       Since we’re inside the <Canvas> element, we have access to special 3D elements that don’t exist in regular HTML.It’s like stepping into a different world — the Canvas provides its own context for 3D rendering.

//       One of these elements is <group>. Think of <group> as the 3D equivalent of a <div> in HTML:
//       In HTML, you use a <div> to wrap elements together, apply flex/grid layout, or move multiple elements as one.

//       In Three.js, <group> lets you bundle several 3D objects together so you can move, rotate, or scale them as a single unit.

//       ✅ Whenever you want several meshes or objects to behave as a single unit, wrap them inside a <group>. This keeps your scene organized and makes transformations easier to manage. */}
//       <mesh>
//         {/* Everything you see in the 3D scene — like the skateboard wheels — is technically a mesh.

//             A mesh has two essential parts:
//             Geometry – This defines the shape of the object.

//             It tells Three.js where all the points (vertices) are and how they connect to form the object.
//             Example: a wheel’s round shape is defined by its geometry.

//             Material – This defines how the surface looks and reacts to light.
//             It includes color, texture, reflections, roughness, and more.
//             ✅ To create any visible object in Three.js or React Three Fiber, you must provide both geometry and material. */}
//         <meshBasicMaterial />
//         <boxGeometry />
//       </mesh>
//     </group>
//   );
// }
