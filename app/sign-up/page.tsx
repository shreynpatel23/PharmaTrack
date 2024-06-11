"use client";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  return (
    <div>
      <h1>Hello from Sign up</h1>
      <button
        className="py-4 px-8 rounded-sm bg-accent text-white"
        onClick={() => router.push("/login")}
      >
        Login
      </button>
    </div>
  );
}
