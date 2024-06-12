"use client";
import Button from "@/app/components/button";
import SearchInput from "@/app/components/search";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/topbar";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useReducer, useState } from "react";
import { ICustomer } from "./interface";
import { fetchData } from "@/utils/fetch";
import FullPageLoading from "@/app/components/full-page-loading";
import moment from "moment";
import EmptyState from "@/app/components/empty-state";

export default function Customers() {
  const router = useRouter();
  const { user } = useUserContext();

  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [error, setError] = useState({
    apiError: "",
  });

  useEffect(() => {
    async function fetchAllCustomers() {
      setIsLoading(true);
      try {
        const response = await fetchData(
          `/api/customer?storeId=${user?.store}`
        );
        const { data } = response;
        setCustomers(data);
      } catch (err: any) {
        setError((error) => ({
          ...error,
          apiError: err.message,
        }));
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllCustomers();

    return () => {
      setIsLoading(false);
    };
  }, []);

  function renderLoadingOrTable() {
    if (isLoading) {
      return (
        <FullPageLoading
          wrapperClassName="h-[60vh] flex items-center justify-center"
          message="Fetching Customer List!"
        />
      );
    }

    if (customers?.length <= 0) {
      return (
        <EmptyState wrapperClassName="h-[80vh] flex items-center justify-center" />
      );
    }

    return (
      <div className="rounded-[16px] overflow-hidden bg-white border border-neutral-200 shadow-table">
        <table className="w-full bg-white rounded-[16px]">
          <thead>
            <tr className="bg-blue w-full rounded-t-2xl">
              <th className="w-[25%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Customer Name
              </th>
              <th className="w-[25%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Email
              </th>
              <th className="w-[25%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Phone Number
              </th>
              <th className="w-[25%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Added On
              </th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((customer) => (
              <tr className="bg-white border-t border-neutral-200">
                <td className="w-[25%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  {customer.firstName} {customer.lastName}
                </td>
                <td className="w-[25%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  {customer.email}
                </td>
                <td className="w-[25%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  +1 {customer.phoneNumber}
                </td>
                <td className="w-[25%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  {moment(customer.createdAt).format("DD MMM YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="flex items-start">
      <Sidebar />
      <div className="flex-1 h-screen overflow-auto">
        <TopBar />
        <div className="px-8 py-4">
          <div className="flex items-center gap-12 pb-12">
            <h3 className="text-xl leading-xl text-black font-workSans">
              Customers
            </h3>
            <Button
              buttonText="Add Customer"
              buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
              onClick={() =>
                router.push(`/store/${user.store}/customers/add-customer`)
              }
            />
            <div className="ml-auto w-[350px]">
              <SearchInput
                type="text"
                id="search"
                name="search"
                placeholder="Search by Customer Name"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>
          </div>
          {renderLoadingOrTable()}
        </div>
      </div>
    </div>
  );
}
