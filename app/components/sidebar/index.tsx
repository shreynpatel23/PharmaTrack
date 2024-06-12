"use client";
import { useStoreContext } from "@/context/storeContext";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { storeId } = useStoreContext();
  const pathname = usePathname().split("/");

  // CONSTANTS
  const SIDEBAR_ITEMS = [
    "Dashboard",
    "Products",
    "Suppliers",
    "Customers",
    "Orders",
    "Users",
  ];

  return (
    <div className="w-[200px]">
      <div className="py-6 pl-6">
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
      <div className="flex flex-col gap-9 py-6 pl-6">
        {SIDEBAR_ITEMS.map((item) => (
          <div key={item} className="flex flex-col gap-1">
            <Link href={`/store/${storeId}/${item.toLowerCase()}`}>
              <p
                className={`text-sm font-medium ${
                  pathname.includes(item.toLowerCase())
                    ? "text-black"
                    : "text-grey"
                }`}
              >
                {item}
              </p>
            </Link>
            {pathname.includes(item.toLowerCase()) && (
              <div className="w-8 h-1 rounded-full bg-accent" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
