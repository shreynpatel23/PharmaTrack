"use client";
import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { postData } from "@/utils/fetch";
import Input from "@/app/components/input";
import ApiError from "@/app/components/api-error";
import Button from "@/app/components/button";
import { useUserContext } from "@/context/userContext";

export default function CreateStore({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  const { userId } = params;
  const router = useRouter();
  const { setToggleFetchUserDetails } = useUserContext();
  const [name, setName] = useState("");
  const [location, setLocation] = useState({
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    city: "",
    provience: "",
    country: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    nameError: "",
    addressLine1Error: "",
    addressLine2Error: "",
    cityError: "",
    provienceError: "",
    countryError: "",
    postalCodeError: "",
    apiError: "",
  });

  const { addressLine1, city, provience, country, postalCode } = location;

  function checkStoreName() {
    if (!name) {
      setError((error) => ({
        ...error,
        nameError: "Store Name is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      nameError: "",
    }));
    return true;
  }

  function checkAddressLine1() {
    if (!addressLine1) {
      setError((error) => ({
        ...error,
        addressLine1Error: "Address is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      addressLine1Error: "",
    }));
    return true;
  }

  function checkCity() {
    if (!city) {
      setError((error) => ({
        ...error,
        cityError: "City is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      cityError: "",
    }));
    return true;
  }

  function checkProvience() {
    if (!provience) {
      setError((error) => ({
        ...error,
        provienceError: "Provience is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      provienceError: "",
    }));
    return true;
  }

  function checkCountry() {
    if (!country) {
      setError((error) => ({
        ...error,
        countryError: "Country is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      countryError: "",
    }));
    return true;
  }

  function checkPostalCode() {
    if (!postalCode) {
      setError((error) => ({
        ...error,
        postalCodeError: "Postal Code is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      postalCodeError: "",
    }));
    return true;
  }

  async function handleAddStore() {
    const ALL_CHECKS_PASS = [
      checkStoreName(),
      checkAddressLine1(),
      checkCity(),
      checkProvience(),
      checkCountry(),
      checkPostalCode(),
    ].every(Boolean);

    if (!ALL_CHECKS_PASS) return;

    setIsLoading(true);
    try {
      const response = await postData(`/api/store?userId=${userId}`, {
        name,
        location,
      });

      setToggleFetchUserDetails(true);
      const { data } = response;
      // fetch the updated user details and store it in the context
      return router.push(`/store/${data?._id}/dashboard`);
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
    <div className="px-16 py-8">
      <div className="mb-6">
        <Link href={"/"}>
          <Image
            src="/logo.svg"
            alt="Logo of PharmaTrack"
            className="h-8"
            width={130}
            height={25}
            priority
          />
        </Link>
      </div>
      <div className="pb-6">
        <h3 className="text-xl leading-xl text-black font-workSane">
          Create Store
        </h3>
        <p className="pt-2 text-sm leading-6 text-heading max-w-[40%]">
          Enter your store details to get started.
        </p>
      </div>
      <div className="bg-white w-[600px] border border-grey/45 shadow-card rounded-[16px] p-8">
        <form>
          <Input
            type="text"
            hasLabel
            label="Store Name"
            placeholder="Enter your store name"
            id="storeName"
            name="storeName"
            hasError={error.nameError !== ""}
            error={error.nameError}
            disabled={isLoading}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            type="text"
            hasLabel
            label="Address Line 1"
            hasError={error.addressLine1Error !== ""}
            error={error.addressLine1Error}
            disabled={isLoading}
            placeholder="Enter store's address line 1"
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
            placeholder="Enter store's address line 2"
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
              buttonText="Create Store"
              isDisabled={isLoading}
              isLoading={isLoading}
              buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
              onClick={() => handleAddStore()}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
