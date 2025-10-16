
"use client";

import { ImageField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";

type Props = {
  foregroundImage: ImageField;
  backgroundImage: ImageField;
  className?: string;
};

export default function ParallaxImage({
  foregroundImage,
  backgroundImage,
  className,
}: Props) {
  // We use `useRef` to directly access and manipulate the DOM elements for our background and foreground images.
  const backgroundRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);

  // We use `useRef` to store animation values (like positions) without triggering a component re-render.
  // This is crucial for performance, as updating state with `useState` would cause a re-render up to 60 times per second.
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // We start the animation loop using `requestAnimationFrame`, a browser function optimized for animations.
    const frameId = requestAnimationFrame(animateFrame);

    // We listen for mouse movements to update the target position of the images.
    window.addEventListener("mousemove", onMouseMove);

    //  * Calculates the new target position for the images based on mouse coordinates.
    //  * The position is normalized to a range of -1 to 1 and scaled for the parallax effect.

    function onMouseMove(event: MouseEvent) {
      const { innerWidth, innerHeight } = window;

      // Normalize mouse coordinates to a -1 to 1 range.
      const xPercent = (event.clientX / innerWidth - 0.5) * 2;
      const yPercent = (event.clientY / innerHeight - 0.5) * 2;

      // Update the target position. We scale the movement with a negative value to make the images move in the opposite direction of the mouse.
      targetPosition.current = {
        x: xPercent * -20,
        y: yPercent * -20,
      };
    }

    /**
     * This function runs on every animation frame (roughly 60 times per second)
     * to smoothly transition the images from their `currentPosition` to the `targetPosition`.
     * This creates a smooth, "eased" movement instead of a sudden jump.
     */
    function animateFrame() {
      const { x: targetX, y: targetY } = targetPosition.current;
      const { x: currentX, y: currentY } = currentPosition.current;

      // We calculate the new position by moving a fraction of the distance (0.1) toward the target.
      // This "easing" effect makes the animation feel smooth.
      const newX = currentX + (targetX - currentX) * 0.1;
      const newY = currentY + (targetY - currentY) * 0.1;

      // Update the current position with the new calculated values.
      currentPosition.current = {
        x: newX,
        y: newY,
      };

      // Apply the new positions to the DOM elements using CSS `transform`.
      // The background image moves less than the foreground for the parallax effect.
      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translate(${newX}px,${newY}px)`;
      }

      // The foreground image moves more aggressively for a stronger parallax effect.
      if (foregroundRef.current) {
        foregroundRef.current.style.transform = `translate(${newY * 2.5}px,${
          newY * 2.5
        }px)`;
      }

      // We request the next animation frame, creating a continuous loop.
      requestAnimationFrame(animateFrame);
    }

    // This cleanup function runs when the component is unmounted.
    return () => {
      // We remove the event listener to prevent memory leaks.
      window.removeEventListener("mousemove", onMouseMove);
      // We cancel the animation loop to stop it from running after the component is gone.
      cancelAnimationFrame(frameId);
    };
  }, []);
  //  The empty dependency array `[]` ensures this effect runs only once, when the component first mounts.

  return (
    <div className={clsx("grid grid-cols-1 place-items-center ", className)}>
      <div
        ref={backgroundRef}
        className="col-start-1 row-start-1 transition-transform"
      >
        <PrismicNextImage field={backgroundImage} alt="" className="w-11/12" />
      </div>

      <div
        ref={foregroundRef}
        className="col-start-1 row-start-1 transition-transform h-full w-full place-items-center"
      >
        <PrismicNextImage
          field={foregroundImage}
          alt=""
          className="h-full max-h-[500px] w-auto"
          imgixParams={{ height: 600 }}
        />
        {/* Prismic's Image CDN automatically optimizes and serves images in modern formats like WebP or AVIF. */}
        {/* This improves performance by reducing file sizes without sacrificing quality. */}
      </div>
    </div>
  );
}








// "use client";

// import { ImageField } from "@prismicio/client";
// import { PrismicNextImage } from "@prismicio/next";
// import clsx from "clsx";
// import React, { useEffect, useRef } from "react"; // useRefs  allows us to access HTML DOM elements directly

// type Props = {
//   foregroundImage: ImageField;
//   backgroundImage: ImageField;
//   className?: string;
// };

// export default function ParallaxImage({
//   foregroundImage,
//   backgroundImage,
//   className,
// }: Props) {
//   const backgroundRef = useRef<HTMLDivElement>(null);
//   const foregroundRef = useRef<HTMLDivElement>(null);

//   const targetPosition = useRef({ x: 0, y: 0 }); //We are keeping the target position (the place we want these images to move to) inside a ref because updating a ref does not trigger a re-render..........You might already be familiar with state (using useState). The reason we’re not using setState here is that it would cause the component to re-render every time the value updates — which could be around 60 times per second. That would be too much for React to handle smoothly, leading to visible lag and janky animations...............Using a ref avoids this problem, since refs can update frequently without forcing re-renders.

//   const currentPosition = useRef({ x: 0, y: 0 }); //If we used the raw values to move objects, the motion would feel stiff and not smooth. For example, when you move your mouse, the objects should keep moving a little with a smooth, interpolated effect — not just snap immediately to the target. To achieve this, we introduce another ref called currentPosition. targetPosition = where we want the images to go. currentPosition = where the images currently are on the screen.

//   useEffect(() => {
//     const frameId =  requestAnimationFrame(animateFrame);

//     window.addEventListener("mousemove", onMouseMove);

//     function onMouseMove(event: MouseEvent) {
//       const { innerWidth, innerHeight } = window;

//       const xPercent = (event.clientX / innerHeight - 0.5) * 2; //Range between -1 and 1
//       const yPercent = (event.clientY / innerHeight - 0.5) * 2; //Range between -1 and 1

//       // console.log({xPercent,yPercent});

//       targetPosition.current = {
//         x: xPercent * -20,
//         y: yPercent * -20,
//       }; //react keeps the current value in the dot current property it's just because of how react works under the hood

//       console.log(targetPosition.current);
//     }

//     function animateFrame() {
//       //We then create a function that runs every frame (about 60 times per second). This function gradually moves currentPosition closer to targetPosition, instead of jumping straight there. This way, the movement feels smooth and animated, because the objects are easing toward the target instead of instantly snapping.
//       const { x: targetX, y: targetY } = targetPosition.current;

//       const { x: currentX, y: currentY } = currentPosition.current;

//       const newX = currentX + (targetX - currentX) * 0.1;
//       const newY = currentY + (targetY - currentY) * 0.1;
//       //The 0.1 factor controls how quickly currentPosition approaches targetPosition. A higher value means faster movement, while a lower value results in slower, smoother motion.

//       //On each animation frame, the object moves a small percentage of the distance between its current position and the target position. If the target is far away, the movement per frame is larger. If the target is close, the movement per frame is smaller.As the gap keeps shrinking, the movement gets slower and slower, creating a smooth easing effect.It’s like the object is “catching up” to the target but slowing down as it gets closer.

//       currentPosition.current = {
//         x: newX,
//         y: newY,
//       };

//       if (backgroundRef.current) {
//         backgroundRef.current.style.transform = `translate(${newX}px,${newY}px)}`;
//       }

//       if (foregroundRef.current) {
//         foregroundRef.current.style.transform = `translate(${newY*2.5}px,${newY*2.5}px)}`;
//       }

//       requestAnimationFrame(animateFrame);
//       //We call requestAnimationFrame(animateFrame) to schedule the next frame of the animation. This creates a loop where animateFrame keeps getting called about 60 times per second, updating the positions and making the movement smooth and continuous.
//       //requestAnimationFrame is a browser function that we use to run animations.We use it instead of something like setInterval because it syncs with the browser’s refresh rate. This makes animations smoother and more efficient, since they update in step with how the screen is being redrawn.
//       //This tells the browser to call animateFrame again on the next frame, creating a continuous loop.

//     }

//     return () => {
//       window.removeEventListener("mousemove", onMouseMove);
//       cancelAnimationFrame(frameId);//It's important to clean up event listeners like this when a component unmounts. If we don't remove them, they can continue to run in the background even after the component is gone, which can lead to memory leaks and unexpected behavior in our application.
//           }; //that if you don't explicitly remove them when this component leaves the DOM it could still be running and that can cause memory leak when our component relieves the DOM it will remove that event listener so we don't have any memory leaks
//   }, []); // We’re using empty square brackets [] in the dependency array because we don’t want this effect to run more than once. It will only run on the initial render, setting up our functions and event listeners..........It will also handle cleaning everything up automatically when the component is unmounted from the DOM.

//   return (
//     <div className={clsx("grid grid-cols-1 place-items-center ", className)}>
//       <div
//         ref={backgroundRef}
//         className="col-start-1 row-start-1 transition-transform"
//       >
//         <PrismicNextImage field={backgroundImage} alt="" className="w-11/12" />
//       </div>

//       <div
//         ref={foregroundRef}
//         className="col-start-1 row-start-1 transition-transform h-full w-full place-items-center"
//       >
//         <PrismicNextImage
//           field={foregroundImage}
//           alt=""
//           className="h-full max-h-[500px] w-auto"
//           imgixParams={{ height: 600 }}
//         />
//         {/* Whenever you host an image on Prismic, it is served through an image CDN. This makes the delivery very fast and efficient.
//         Even if you upload a JPEG, Prismic’s CDN can serve it as modern formats like AVIF or WebP, which are highly compressed. These formats look great but are much smaller in size, giving you better performance.
//         One of the key benefits of using an image CDN is that you can apply different transforms directly in the image URL. This means you can upload a large image but request a smaller, optimized version when needed. */}
//       </div>
//     </div>
//   );
// }
