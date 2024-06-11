"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../components/input";
import Button from "../components/button";
import ArrowRight from "../components/icons/ArrowRight";

export default function Signup() {
  const router = useRouter();
  return (
    <div className="h-[100vh] flex items-center">
      <div className="w-[50%] flex flex-col items-center">
        <div className="px-8 py-12 max-w-[500px] bg-white rounded-[16px] shadow-card border border-[#AFB0B2]/45">
          <div className="mb-6">
            <Link href={"/"}>
              <Image
                src="/logo.svg"
                alt="Logo of PharmaTrack"
                className="h-8"
                width={150}
                height={30}
                priority
              />
            </Link>
          </div>
          <h1 className="text-2xl leading-7 font-workSans font-medium text-black">
            Welcome to Pharmatrack
          </h1>
          <p className="text-sm leading-6 text-grey py-2">
            <span>
              <Link
                href={"/login"}
                className="text-accent font-medium underline text-md leading-md"
              >
                Log In
              </Link>{" "}
              or Create New Account to get started using Pharmatrack{" "}
            </span>
          </p>
          <form className="pt-4">
            <div className="flex items-center gap-6">
              <Input
                type="text"
                hasLabel
                label="First Name"
                placeholder="Enter your first name"
              />
              <Input
                type="text"
                hasLabel
                label="Last Name"
                placeholder="Enter your last name"
              />
            </div>
            <div className="flex items-center gap-6">
              <Input
                type="email"
                hasLabel
                label="Email"
                placeholder="Enter your email address"
              />
              <Input
                type="tel"
                hasLabel
                label="Phone Number"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="flex items-center gap-6">
              <Input
                type="password"
                hasLabel
                label="Password"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center gap-6 my-6">
              <Button
                buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white"
                buttonText="Sign Up"
                hasIcon
                icon={<ArrowRight width="24" height="24" fill="white" />}
                onClick={() => console.log("sign up")}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="w-[50%] pl-12">
        <img
          src="/sign-up-illustration.svg"
          alt="Illustration for Sign Up Page"
          className="w-[400px]"
        />
      </div>
    </div>
  );
}
