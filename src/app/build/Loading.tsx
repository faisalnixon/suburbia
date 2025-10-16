"use client";
import { Logo } from "@/components/Logo";
import { useProgress } from "@react-three/drei";
import clsx from "clsx";
export default function Loading() {
  const { progress } = useProgress();
  return (
    <div
      className={clsx(
        "absolute inset-0 grid place-content-center bg-brand-navy font-sans text-[15vw] text-white transition-opacity duration-1000",
        progress >= 100 ? "pointer-events-none opacity-0" : "opacity-100"
      )} // progress >= 100 means loading is done and we can hide the loader. progress is a number from 0 to 100. progress 50 means half way done.
    >
      <Logo className="w-[15vw] animate-squiggle text-brand-pink" />
      <p className="w-full animate-squiggle content-center text-center leading-none text-green-400">
        LOADING...
      </p>
    </div>
  );
}
