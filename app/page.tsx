"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <h1>Hello from PharmaTrack</h1>
      <button
        className="py-4 px-8 rounded-sm bg-orange-500 text-white"
        onClick={() => router.push("/login")}
      >
        Get Started
      </button>
    </>
  );
}
