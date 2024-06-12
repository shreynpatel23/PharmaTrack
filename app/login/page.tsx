"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../components/input";
import Button from "../components/button";
import ArrowRight from "../components/icons/ArrowRight";
import { useState } from "react";
import { postData } from "@/utils/fetch";
import { useStoreContext } from "@/context/storeContext";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
    apiError: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // CONTEXT
  const { setStoreId } = useStoreContext();

  function checkEmail() {
    if (!email) {
      setError((error) => ({
        ...error,
        emailError: "Email is required",
      }));
      return false;
    }
    if (!email.includes("@")) {
      setError((error) => ({
        ...error,
        emailError: "Please enter a valid email",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      emailError: "",
    }));
    return true;
  }

  function checkPassword() {
    if (!password) {
      setError((error) => ({
        ...error,
        passwordError: "Password is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      passwordError: "",
    }));
    return true;
  }

  async function handleLogin() {
    const ALL_CHECKS_PASS = [checkPassword(), checkEmail()].every(Boolean);

    if (!ALL_CHECKS_PASS) return;

    setIsLoading(true);
    try {
      const response = await postData("/api/login", {
        email,
        password,
      });
      const { data } = response;
      if (!data.store) {
        return router.push("/onboarding");
      }
      setStoreId(data?.store);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("storeId", data?.store);
        }
      } catch (error) {
        console.error("Error while setting token in localStorage:", error);
      }
      return router.push(`/store/${data?.store}/dashboard`);
    } catch (err: any) {
      setError((error) => ({
        ...error,
        apiError: err.message,
      }));
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="h-[100vh] flex items-center">
      <div className="w-[50%] flex flex-col items-center">
        <div className="px-8 py-12 max-w-[500px] bg-white rounded-[16px] shadow-card border border-[#AFB0B2]/45">
          <div className="mb-8">
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
                href={"/sign-up"}
                className="text-accent font-medium underline text-md leading-md"
              >
                Create New Account
              </Link>{" "}
              or Log In to get started using Pharmatrack{" "}
            </span>
          </p>
          <form className="pt-4">
            <Input
              type="email"
              hasLabel
              label="Email"
              placeholder="Enter your email address"
              onChange={(event) => setEmail(event.target.value)}
              hasError={error.emailError !== ""}
              error={error.emailError}
              disabled={isLoading}
            />
            <Input
              type="password"
              hasLabel
              label="Password"
              placeholder="Enter your password"
              onChange={(event) => setPassword(event.target.value)}
              hasError={error.passwordError !== ""}
              error={error.passwordError}
              disabled={isLoading}
            />
            {error.apiError && (
              <p className="text-error text-sm font-medium py-2">
                {error.apiError}
              </p>
            )}
            <div className="flex items-center gap-6 my-6">
              <Button
                isDisabled={isLoading}
                isLoading={isLoading}
                buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white"
                buttonText="Log In"
                hasIcon
                icon={<ArrowRight width="24" height="24" fill="white" />}
                onClick={() => handleLogin()}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="w-[50%] pl-12">
        <img
          src="/login-illustration.svg"
          alt="Illustration for Login Page"
          className="w-[400px]"
        />
      </div>
    </div>
  );
}
