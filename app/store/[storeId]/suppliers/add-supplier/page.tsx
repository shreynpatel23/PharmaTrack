"use client";
import Input from "@/app/components/input";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/topbar";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ISupplier } from "../interface";
import ApiError from "@/app/components/api-error";
import Button from "@/app/components/button";
import { postData } from "@/utils/fetch";

export default function AddSupplier() {
  const router = useRouter();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [supplier, setSupplier] = useState<ISupplier>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [location, setLocation] = useState({
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    city: "",
    provience: "",
    country: "",
  });

  const [error, setError] = useState({
    emailError: "",
    firstNameError: "",
    lastNameError: "",
    phoneNumberError: "",
    addressLine1Error: "",
    addressLine2Error: "",
    postalCodeError: "",
    cityError: "",
    provienceError: "",
    countryError: "",
    apiError: "",
  });

  const { firstName, lastName, email, phoneNumber } = supplier;

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

  async function handleAddsupplier() {
    const ALL_CHECKS_PASS = [
      checkEmail(),
      checkFirstName(),
      checkLastName(),
      checkPhoneNumber(),
    ].every(Boolean);

    if (!ALL_CHECKS_PASS) return;

    setIsLoading(true);
    try {
      const response = await postData("/api/supplier", {
        firstName,
        lastName,
        phoneNumber,
        email,
        location,
      });
      const { data } = response;
      router.push(`/store/${data?.store}/suppliers`);
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
            Add Supplier
          </h3>
          <div className="bg-white w-[600px] border border-grey/45 shadow-card rounded-[16px] p-8">
            <form>
              <div className="flex items-center gap-4">
                <div className="w-[50%]">
                  <Input
                    type="text"
                    hasLabel
                    label="First Name"
                    placeholder="Enter supplier's first name"
                    id="firstName"
                    name="firstName"
                    hasError={error.firstNameError !== ""}
                    error={error.firstNameError}
                    disabled={isLoading}
                    onChange={(event) =>
                      setSupplier((supplier) => ({
                        ...supplier,
                        firstName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="w-[50%]">
                  <Input
                    type="text"
                    hasLabel
                    label="Last Name"
                    placeholder="Enter supplier's last name"
                    id="lastName"
                    name="lastName"
                    hasError={error.lastNameError !== ""}
                    error={error.lastNameError}
                    disabled={isLoading}
                    onChange={(event) =>
                      setSupplier((supplier) => ({
                        ...supplier,
                        lastName: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-[50%]">
                  <Input
                    type="email"
                    hasLabel
                    label="Email"
                    placeholder="Enter supplier's email"
                    id="email"
                    name="email"
                    hasError={error.emailError !== ""}
                    error={error.emailError}
                    disabled={isLoading}
                    onChange={(event) =>
                      setSupplier((supplier) => ({
                        ...supplier,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="w-[50%]">
                  <Input
                    type="text"
                    hasLabel
                    label="Phone Number"
                    hasError={error.phoneNumberError !== ""}
                    error={error.phoneNumberError}
                    disabled={isLoading}
                    maxLength={10}
                    placeholder="Enter supplier's phone"
                    id="phoneNumber"
                    name="phoneNumber"
                    onChange={(event) =>
                      setSupplier((supplier) => ({
                        ...supplier,
                        phoneNumber: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <Input
                type="text"
                hasLabel
                label="Address Line 1"
                hasError={error.addressLine1Error !== ""}
                error={error.addressLine1Error}
                disabled={isLoading}
                placeholder="Enter supplier's address line 1"
                id="addressLine1"
                name="addressLine1"
                onChange={(event) =>
                  setLocation((location) => ({
                    ...location,
                    addressLine1: event.target.value,
                  }))
                }
              />
              <Input
                type="text"
                hasLabel
                label="Address Line 2"
                hasError={error.addressLine2Error !== ""}
                error={error.addressLine2Error}
                disabled={isLoading}
                placeholder="Enter supplier's address line 2"
                id="addressLine2"
                name="addressLine2"
                onChange={(event) =>
                  setLocation((location) => ({
                    ...location,
                    addressLine2: event.target.value,
                  }))
                }
              />
              <div className="flex items-center gap-4">
                <div className="w-[50%]">
                  <Input
                    type="text"
                    hasLabel
                    label="City"
                    hasError={error.cityError !== ""}
                    error={error.cityError}
                    disabled={isLoading}
                    placeholder="Enter city"
                    id="city"
                    name="city"
                    onChange={(event) =>
                      setLocation((location) => ({
                        ...location,
                        city: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="w-[50%]">
                  <Input
                    type="text"
                    hasLabel
                    label="Provience"
                    hasError={error.provienceError !== ""}
                    error={error.provienceError}
                    disabled={isLoading}
                    placeholder="Enter Provience"
                    id="provience"
                    name="provience"
                    onChange={(event) =>
                      setLocation((location) => ({
                        ...location,
                        provience: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-[50%]">
                  <Input
                    type="text"
                    hasLabel
                    label="Country"
                    hasError={error.countryError !== ""}
                    error={error.countryError}
                    disabled={isLoading}
                    placeholder="Enter Country"
                    id="country"
                    name="country"
                    onChange={(event) =>
                      setLocation((location) => ({
                        ...location,
                        country: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="w-[50%]">
                  <Input
                    type="text"
                    hasLabel
                    label="Postal Code"
                    hasError={error.postalCodeError !== ""}
                    error={error.postalCodeError}
                    disabled={isLoading}
                    maxLength={6}
                    placeholder="Enter postal Code"
                    id="postalCode"
                    name="postalCode"
                    onChange={(event) =>
                      setLocation((location) => ({
                        ...location,
                        postalCode: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              {error.apiError && <ApiError errorMessage={error.apiError} />}
              <div className="pt-6 flex items-center gap-8">
                <Button
                  buttonText="Cancel"
                  isDisabled={isLoading}
                  buttonClassName="rounded-md bg-transparent hover:bg-accent text-accent hover:text-white text-md leading-md font-medium"
                  onClick={() => router.push(`/store/${user.store}/suppliers`)}
                />
                <Button
                  buttonText="Add Supplier"
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
                  onClick={() => handleAddsupplier()}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
