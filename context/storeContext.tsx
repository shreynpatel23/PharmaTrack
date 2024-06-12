"use client";
import { createContext, useContext, useState } from "react";

const Context = createContext<{
  storeId: string;
  setStoreId: (storeId: string) => void;
}>({
  storeId: "",
  setStoreId: () => {},
});

export function StoreContext({ children }: { children: React.ReactNode }) {
  const id = localStorage.getItem("storeId");
  const [storeId, setStoreId] = useState(id ?? "");

  return (
    <Context.Provider value={{ storeId, setStoreId }}>
      {children}
    </Context.Provider>
  );
}

export function useStoreContext() {
  return useContext(Context);
}
