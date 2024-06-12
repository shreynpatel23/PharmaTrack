"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../components/input";
import Button from "../components/button";
import ArrowRight from "../components/icons/ArrowRight";
import { useState } from "react";
import { postData } from "@/utils/fetch";

export default function Signup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
    firstNameError: "",
    lastNameError: "",
    phoneNumberError: "",
    apiError: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

  function checkFirstName() {
    if (!firstName) {
      setError((error) => ({
        ...error,
        firstNameError: "First Name is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      firstNameError: "",
    }));
    return true;
  }

  function checkLastName() {
    if (!lastName) {
      setError((error) => ({
        ...error,
        lastNameError: "Last Name is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      lastNameError: "",
    }));
    return true;
  }

  function checkPhoneNumber() {
    if (!phoneNumber) {
      setError((error) => ({
        ...error,
        phoneNumberError: "Phone Number is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      phoneNumberError: "",
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

  async function handleSignUp() {
    const ALL_CHECKS_PASS = [
      checkPassword(),
      checkEmail(),
      checkFirstName(),
      checkLastName(),
      checkPhoneNumber(),
    ].every(Boolean);

    if (!ALL_CHECKS_PASS) return;

    setIsLoading(true);
    try {
      const response = await postData("/api/sign-up", {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
      });
      const { data } = response;
      if (data) {
        return router.push(`/onboarding`);
      }
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
                onChange={(event) => setFirstName(event.target.value)}
                hasError={error.firstNameError !== ""}
                error={error.firstNameError}
                disabled={isLoading}
              />
              <Input
                type="text"
                hasLabel
                label="Last Name"
                placeholder="Enter your last name"
                onChange={(event) => setLastName(event.target.value)}
                hasError={error.lastNameError !== ""}
                error={error.lastNameError}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-6">
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
                type="tel"
                hasLabel
                label="Phone Number"
                placeholder="Enter your phone number"
                onChange={(event) => setPhoneNumber(event.target.value)}
                hasError={error.phoneNumberError !== ""}
                error={error.phoneNumberError}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-6">
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
            </div>
            {error.apiError && (
              <p className="text-error text-sm font-medium py-2">
                {error.apiError}
              </p>
            )}
            <div className="flex items-center gap-6 my-6">
              <Button
                buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white"
                buttonText="Sign Up"
                hasIcon
                icon={<ArrowRight width="24" height="24" fill="white" />}
                isDisabled={isLoading}
                isLoading={isLoading}
                onClick={() => handleSignUp()}
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
