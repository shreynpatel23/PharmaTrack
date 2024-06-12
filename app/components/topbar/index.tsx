"use client";
import { useUserContext } from "@/context/userContext";
import { fetchData } from "@/utils/fetch";
import React, { useState } from "react";
import Loading from "../loading";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();

  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    apiError: "",
  });

  async function handleLogout() {
    setIsLoading(true);
    try {
      const response = await fetchData("/api/logout");
      const { message } = response;
      console.log(message);
      return router.replace("/login");
    } catch (err: any) {
      setError((error) => ({
        ...error,
        apiError: err.message,
      }));
    } finally {
      setIsLoading(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("userId");
      }
    }
  }

  return (
    <div className="py-4 px-8 flex items-center">
      <h2 className="text-xl leading-xl text-black font-medium">
        👋🏻 {user.firstName} {user.lastName}
      </h2>
      <div className="ml-auto">
        <>
          {error.apiError && (
            <p className="text-error text-sm font-medium py-2">
              {error.apiError}
            </p>
          )}
          {isLoading ? (
            <Loading />
          ) : (
            <button
              className="px-4 py-2 bg-transparent border-0 rounded-[8px] transition-all hover:bg-error hover:text-white font-medium text-sm text-grey"
              onClick={() => handleLogout()}
            >
              logout
            </button>
          )}
        </>
      </div>
    </div>
  );
}
