"use client";
import Button from "@/app/components/button";
import Input from "@/app/components/input";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/topbar";
import React, { useState } from "react";
import { ICustomer } from "../interface";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { postData } from "@/utils/fetch";
import ApiError from "@/app/components/api-error";

export default function AddCustomer() {
  const router = useRouter();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState<ICustomer>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [error, setError] = useState({
    emailError: "",
    firstNameError: "",
    lastNameError: "",
    phoneNumberError: "",
    apiError: "",
  });

  const { firstName, lastName, email, phoneNumber } = customer;

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

  async function handleAddCustomer() {
    const ALL_CHECKS_PASS = [
      checkEmail(),
      checkFirstName(),
      checkLastName(),
      checkPhoneNumber(),
    ].every(Boolean);

    if (!ALL_CHECKS_PASS) return;

    setIsLoading(true);
    try {
      const response = await postData("/api/customer", {
        firstName,
        lastName,
        phoneNumber,
        email,
        storeId: user?.store,
      });
      const { data } = response;
      router.push(`/store/${data?.store}/customers`);
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
    <div className="flex items-start">
      <Sidebar />
      <div className="flex-1 h-screen overflow-auto">
        <TopBar />
        <div className="px-8 py-4">
          <h3 className="text-xl leading-xl text-black font-workSans pb-6">
            Add Customer
          </h3>
          <div className="bg-white w-[450px] border border-grey/45 shadow-card rounded-[16px] p-8">
            <form>
              <Input
                type="text"
                hasLabel
                label="First Name"
                placeholder="Enter customer's first name"
                id="firstName"
                name="firstName"
                hasError={error.firstNameError !== ""}
                error={error.firstNameError}
                disabled={isLoading}
                onChange={(event) =>
                  setCustomer((customer) => ({
                    ...customer,
                    firstName: event.target.value,
                  }))
                }
              />
              <Input
                type="text"
                hasLabel
                label="Last Name"
                placeholder="Enter customer's last name"
                id="lastName"
                name="lastName"
                hasError={error.lastNameError !== ""}
                error={error.lastNameError}
                disabled={isLoading}
                onChange={(event) =>
                  setCustomer((customer) => ({
                    ...customer,
                    lastName: event.target.value,
                  }))
                }
              />
              <Input
                type="email"
                hasLabel
                label="Email"
                placeholder="Enter customer's email"
                id="email"
                name="email"
                hasError={error.emailError !== ""}
                error={error.emailError}
                disabled={isLoading}
                onChange={(event) =>
                  setCustomer((customer) => ({
                    ...customer,
                    email: event.target.value,
                  }))
                }
              />
              <Input
                type="text"
                hasLabel
                label="Phone Number"
                hasError={error.phoneNumberError !== ""}
                error={error.phoneNumberError}
                disabled={isLoading}
                maxLength={10}
                placeholder="Enter customer's phone"
                id="phoneNumber"
                name="phoneNumber"
                onChange={(event) =>
                  setCustomer((customer) => ({
                    ...customer,
                    phoneNumber: event.target.value,
                  }))
                }
              />
              {error.apiError && <ApiError errorMessage={error.apiError} />}
              <div className="pt-6 flex items-center gap-8">
                <Button
                  buttonText="Cancel"
                  isDisabled={isLoading}
                  buttonClassName="rounded-md bg-transparent hover:bg-accent text-accent hover:text-white text-md leading-md font-medium"
                  onClick={() => router.push(`/store/${user.store}/customers`)}
                />
                <Button
                  buttonText="Add Customer"
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
                  onClick={() => handleAddCustomer()}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
