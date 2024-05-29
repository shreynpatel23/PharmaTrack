"use client";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  return (
    <div>
      <h1>Hello from Login</h1>
      <button
        className="py-4 px-8 rounded-sm bg-orange-500 text-white"
        onClick={() => router.push("/sign-up")}
      >
        Sign up
      </button>
    </div>
  );
}
