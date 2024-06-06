"use client";
import { useRouter } from "next/navigation";
import Button from "./components/button";
import Input from "./components/input";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <h1 className="font-workSans text-2xl">Hello from PharmaTrack</h1>
      <Button
        buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white"
        buttonText="Get Started"
        hasIcon={false}
        onClick={() => router.push("/login")}
      />

      <Input
        label="First Name"
        hasLabel
        placeholder="Enter your first name"
        disabled
      />
    </>
  );
}
