"use client";
import ApiError from "@/app/components/api-error";
import ApiSuccess from "@/app/components/api-success";
import Button from "@/app/components/button";
import SearchInput from "@/app/components/search";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/topbar";
import { useUserContext } from "@/context/userContext";
import { isUserAdmin } from "@/utils/checkProtectedRoutes";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ISupplier } from "./interface";
import { deleteData, fetchData } from "@/utils/fetch";
import FullPageLoading from "@/app/components/full-page-loading";
import EmptyState from "@/app/components/empty-state";
import moment from "moment";
import DeleteModal from "@/app/components/delete-modal";

export default function Suppliers() {
  const router = useRouter();
  const { user } = useUserContext();

  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteSupplierLoading, setDeleteSupplierLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [successDeleteMessage, setSuccessDeleteMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    toggle: boolean;
    data: ISupplier;
  }>({
    toggle: false,
    data: {},
  });
  const [error, setError] = useState({
    apiError: "",
  });

  const fetchAllSuppliers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchData(`/api/supplier`);
      const { data } = response;
      setSuppliers(data);
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
    fetchAllSuppliers();

    return () => {
      setIsLoading(false);
    };
  }, [fetchAllSuppliers]);

  // delete supplier api call
  async function handleDeleteSupplier() {
    setDeleteSupplierLoading(true);
    try {
      const response = await deleteData("/api/supplier", {
        supplierId: deleteModal.data._id,
      });
      const { message } = response;
      setSuccessDeleteMessage(message);
      setDeleteModal({
        toggle: false,
        data: {},
      });
      fetchAllSuppliers();
    } catch (err: any) {
      setError((error) => ({
        ...error,
        apiError: err.message,
      }));
    } finally {
      setDeleteSupplierLoading(false);
    }
  }

  function renderLoadingOrTable() {
    if (isLoading) {
      return (
        <FullPageLoading
          wrapperClassName="h-[60vh] flex items-center justify-center"
          message="Fetching Supplier List!"
        />
      );
    }

    if (suppliers?.length <= 0) {
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
                Supplier Name
              </th>
              <th className="w-[25%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Email
              </th>
              <th className="w-[25%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Phone
              </th>
              <th className="w-[15%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Location
              </th>
              <th className="w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {suppliers?.map((supplier) => (
              <tr
                className="bg-white border-t border-neutral-200 group"
                key={supplier._id}
              >
                <td className="w-[25%] pl-6 py-4">
                  <p className="text-black font-regular text-[14px] leading-md">
                    {supplier.firstName} {supplier.lastName}
                  </p>
                  <p className="text-[12px] leading-sm text-grey pt-1">
                    Added on
                    <span className="pl-1 text-[12px] font-medium text-black">
                      {moment(supplier.createdAt).format("YYYY/MM/DD")}
                    </span>
                  </p>
                </td>
                <td className="w-[25%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  {supplier.email}
                </td>
                <td className="w-[25%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  +1 {supplier.phoneNumber}
                </td>
                <td className="w-[15%] pl-6 py-4">
                  <p className="text-black font-regular text-[14px] leading-md">
                    {supplier.location?.city}, {supplier.location?.provience}
                  </p>
                  <p className="text-[12px] font-medium pt-1 leading-sm text-grey">
                    {supplier.location?.postalCode}
                  </p>
                </td>
                <td className="w-[10%]">
                  {isUserAdmin(user) && (
                    <div className="hidden group-hover:block">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-orange"
                          onClick={() =>
                            router.push(
                              `/store/${user.store}/suppliers/edit-supplier/${supplier?._id}`
                            )
                          }
                        >
                          <img
                            src="/Edit.svg"
                            alt="Edit Icon for Supplier"
                            className="w-[16px]"
                          />
                        </button>
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFE9E9]"
                          onClick={() =>
                            setDeleteModal({
                              toggle: true,
                              data: supplier,
                            })
                          }
                        >
                          <img
                            src="/Delete.svg"
                            alt="Delete Icon for Supplier"
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
              Suppliers
            </h3>
            {isUserAdmin(user) && (
              <Button
                buttonText="Add Supplier"
                buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
                onClick={() =>
                  router.push(`/store/${user.store}/suppliers/add-supplier`)
                }
              />
            )}
            <div className="ml-auto w-[350px]">
              <SearchInput
                type="text"
                id="search"
                name="search"
                placeholder="Search by Supplier Name"
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
          heading="Delete Supplier"
          subHeading={`Are you sure you want to delete "${deleteModal.data.firstName} ${deleteModal.data.lastName}" from your Supplier's List. Please keep in mind that these changes will not be reverted`}
          isLoading={deleteSupplierLoading}
          onCancel={() =>
            setDeleteModal({
              toggle: false,
              data: {},
            })
          }
          onConfirm={() => handleDeleteSupplier()}
        />
      )}
    </div>
  );
}
