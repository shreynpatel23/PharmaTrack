"use client";
import Button from "@/app/components/button";
import SearchInput from "@/app/components/search";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/topbar";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { ICustomer } from "./interface";
import { deleteData, fetchData } from "@/utils/fetch";
import FullPageLoading from "@/app/components/full-page-loading";
import moment from "moment";
import EmptyState from "@/app/components/empty-state";
import ApiError from "@/app/components/api-error";
import DeleteModal from "@/app/components/delete-modal";
import ApiSuccess from "@/app/components/api-success";
import { isUserAdmin } from "@/utils/checkProtectedRoutes";

export default function Customers() {
  const router = useRouter();
  const { user } = useUserContext();

  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteCustomerLoading, setDeleteCustomerLoading] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [successDeleteMessage, setSuccessDeleteMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    toggle: boolean;
    data: ICustomer;
  }>({
    toggle: false,
    data: {},
  });
  const [error, setError] = useState({
    apiError: "",
  });

  const fetchAllCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchData(`/api/customer?storeId=${user?.store}`);
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
  }, []);

  useEffect(() => {
    fetchAllCustomers();

    return () => {
      setIsLoading(false);
    };
  }, [fetchAllCustomers]);

  // delete customer api call
  async function handleDeleteCustomer() {
    setDeleteCustomerLoading(true);
    try {
      const response = await deleteData(
        `/api/customer?storeId=${user?.store}`,
        {
          customerId: deleteModal.data._id,
          storeId: user?.store,
        }
      );
      const { message } = response;
      setSuccessDeleteMessage(message);
      setDeleteModal({
        toggle: false,
        data: {},
      });
      fetchAllCustomers();
    } catch (err: any) {
      setError((error) => ({
        ...error,
        apiError: err.message,
      }));
    } finally {
      setDeleteCustomerLoading(false);
    }
  }

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
        <EmptyState wrapperClassName="h-[60vh] flex items-center justify-center" />
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
              <th className="w-[15%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Added On
              </th>
              <th className="w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((customer) => (
              <tr
                className="bg-white border-t border-neutral-200 group"
                key={customer._id}
              >
                <td className="w-[25%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  {customer.firstName} {customer.lastName}
                </td>
                <td className="w-[25%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  {customer.email}
                </td>
                <td className="w-[25%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  +1 {customer.phoneNumber}
                </td>
                <td className="w-[15%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  {moment(customer.createdAt).format("DD MMM YYYY")}
                </td>
                <td className="w-[10%]">
                  {isUserAdmin(user) && (
                    <div className="hidden group-hover:block">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-orange"
                          onClick={() =>
                            router.push(
                              `/store/${user.store}/customers/edit-customer/${customer?._id}`
                            )
                          }
                        >
                          <img
                            src="/Edit.svg"
                            alt="Edit Icon for Customers"
                            className="w-[16px]"
                          />
                        </button>
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFE9E9]"
                          onClick={() =>
                            setDeleteModal({
                              toggle: true,
                              data: customer,
                            })
                          }
                        >
                          <img
                            src="/Delete.svg"
                            alt="Delete Icon for Customers"
                            className="w-[16px]"
                          />
                        </button>
                      </div>
                    </div>
                  )}
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
            {isUserAdmin(user) && (
              <Button
                buttonText="Add Customer"
                buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
                onClick={() =>
                  router.push(`/store/${user.store}/customers/add-customer`)
                }
              />
            )}
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
          {error.apiError && <ApiError errorMessage={error.apiError} />}
          {successDeleteMessage && (
            <ApiSuccess
              message={successDeleteMessage}
              setMessage={(value) => setSuccessDeleteMessage(value)}
            />
          )}
          {renderLoadingOrTable()}
        </div>
      </div>
      {deleteModal.toggle && (
        <DeleteModal
          heading="Delete Customer"
          subHeading={`Are you sure you want to delete "${deleteModal.data.firstName} ${deleteModal.data.lastName}" from your Customer's List. Please keep in mind that these changes will not be reverted`}
          isLoading={deleteCustomerLoading}
          onCancel={() =>
            setDeleteModal({
              toggle: false,
              data: {},
            })
          }
          onConfirm={() => handleDeleteCustomer()}
        />
      )}
    </div>
  );
}
