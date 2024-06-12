"use client";
import Loading from "@/app/components/loading";
import { fetchData } from "@/utils/fetch";
import { redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface IUser {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  status: boolean;
  role: {
    id: string;
    name: string;
  };
  store: string;
}

const INITIAL_STATE: IUser = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  status: false,
  role: {
    id: "",
    name: "",
  },
  store: "",
};

const Context = createContext<{
  user: IUser;
  setUser: (user: IUser) => void;
}>({
  user: INITIAL_STATE,
  setUser: () => {},
});

export function UserContext({ children }: { children: React.ReactNode }) {
  const userId =
    (typeof window !== "undefined" && localStorage.getItem("userId")) ?? "";
  const [user, setUser] = useState<IUser>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState<boolean>();

  useEffect(() => {
    async function getUserDetails(userId: string) {
      try {
        const response = await fetchData(`/api/users/${userId}`);
        const { data } = response;
        setUser(data);
      } catch (err: any) {
        // TODO: Shoot a toast message here
        redirect("/");
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      setIsLoading(true);
      getUserDetails(userId);
    }

    return () => {
      setIsLoading(false);
    };
  }, [userId]);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
      }}
    >
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4">
              <Loading />
            </div>
            <p className="text-sm leading-5 font-medium text-black text-center">
              Fetching user details. Please hang on a sec!
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </Context.Provider>
  );
}

export function useUserContext() {
  return useContext(Context);
}
