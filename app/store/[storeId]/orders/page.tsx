"use client";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/topbar";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { IOrder } from "./interface";
import { deleteData, fetchData } from "@/utils/fetch";
import FullPageLoading from "@/app/components/full-page-loading";
import EmptyState from "@/app/components/empty-state";
import { isUserAdmin } from "@/utils/checkProtectedRoutes";
import moment from "moment";
import { STATUS, TYPE } from "@/constants/Order";
import DeleteModal from "@/app/components/delete-modal";
import Button from "@/app/components/button";
import SearchInput from "@/app/components/search";
import ApiError from "@/app/components/api-error";
import ApiSuccess from "@/app/components/api-success";

export default function Orders() {
  const router = useRouter();
  const { user } = useUserContext();

  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteOrderLoading, setDeleteOrderLoading] = useState(false);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [successDeleteMessage, setSuccessDeleteMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    toggle: boolean;
    data: IOrder;
  }>({
    toggle: false,
    data: {},
  });
  const [error, setError] = useState({
    apiError: "",
  });

  const fetchAllOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchData(`/api/order?storeId=${user?.store}`);
      const { data } = response;
      setOrders(data);
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
    fetchAllOrders();

    return () => {
      setIsLoading(false);
    };
  }, [fetchAllOrders]);

  // delete order api call
  async function handleDeleteOrder() {
    setDeleteOrderLoading(true);
    try {
      const response = await deleteData("/api/order", {
        orderId: deleteModal.data._id,
        storeId: user?.store,
      });
      const { message } = response;
      setSuccessDeleteMessage(message);
      setDeleteModal({
        toggle: false,
        data: {},
      });
      fetchAllOrders();
    } catch (err: any) {
      setError((error) => ({
        ...error,
        apiError: err.message,
      }));
    } finally {
      setDeleteOrderLoading(false);
    }
  }

  function renderTypeIcon(type: string) {
    if (type.toLowerCase() === TYPE.PURCHASE.toLowerCase()) {
      return (
        <img
          src="/Purchase-order.svg"
          alt="Purchase order icon"
          className="w-4"
        />
      );
    }
    return (
      <img src="/Sales-order.svg" alt="Sales order icon" className="w-4" />
    );
  }

  function renderStatusStyle(status: string) {
    if (status.toLowerCase() === STATUS.COMPLETED.toLowerCase()) {
      return "bg-[#E4FAE5] text-success";
    }
    if (status.toLowerCase() === STATUS.PENDING.toLowerCase()) {
      return "bg-orange text-accent";
    }
    if (status.toLowerCase() === STATUS.SOLD.toLowerCase()) {
      return "bg-[#E4EAFB] text-[#4C75E0]";
    }
    return "bg-neutral-200 text-neutral-700";
  }

  function renderLoadingOrTable() {
    if (isLoading) {
      return (
        <FullPageLoading
          wrapperClassName="h-[60vh] flex items-center justify-center"
          message="Fetching Orders!"
        />
      );
    }

    if (orders?.length <= 0) {
      return (
        <EmptyState wrapperClassName="h-[60vh] flex items-center justify-center" />
      );
    }

    return (
      <div className="rounded-[16px] overflow-hidden bg-white border border-neutral-200 shadow-table">
        <table className="w-full bg-white rounded-[16px]">
          <thead>
            <tr className="bg-blue w-full rounded-t-2xl">
              <th className="w-[8%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Order ID
              </th>
              <th className="w-[18%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Product Name
              </th>
              <th className="w-[12%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Type
              </th>
              <th className="w-[10%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Quantity
              </th>
              <th className="w-[10%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Amount
              </th>
              <th className="w-[10%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Status
              </th>
              <th className="w-[20%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Created By
              </th>
              <th className="w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order: any) => (
              <tr
                className="bg-white border-t border-neutral-200 group"
                key={order._id}
              >
                <td className="w-[7%] pl-6 py-4 text-black font-regular text-[12px] leading-md break-words break-all">
                  {order._id}
                </td>
                <td className="w-[18%] pl-6 py-4">
                  <p className="text-black font-medium text-[14px] leading-md">
                    {order.product?.productName}
                  </p>
                  <p className="text-[12px] leading-sm text-grey pt-1">
                    Created on
                    <span className="pl-1 text-[12px] font-medium text-black">
                      {moment(order.createdAt).format("YYYY/MM/DD")}
                    </span>
                  </p>
                </td>
                <td className="w-[12%] pl-6 py-4">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                      order?.type.toLowerCase() === TYPE.PURCHASE.toLowerCase()
                        ? "bg-blue/50"
                        : "bg-[#E4FAE5]/50"
                    }`}
                  >
                    {renderTypeIcon(order.type)}
                    <p
                      className={`text-[12px] font-medium leading-md ${
                        order?.type.toLowerCase() ===
                        TYPE.PURCHASE.toLowerCase()
                          ? "text-[#4C75E0]"
                          : "text-success"
                      }`}
                    >
                      {order.type}
                    </p>
                  </div>
                </td>
                <td className={`w-[10%] pl-6 py-4`}>
                  <div>
                    <p className="text-[14px] leading-md text-black font-regular">
                      {order.quantity} units
                    </p>
                  </div>
                </td>
                <td className="w-[10%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  $ {Number(order.amount).toFixed(2)}
                </td>
                <td className="w-[10%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  <p
                    className={`inline text-[12px] font-medium leading-md px-3 py-1.5 rounded-full ${renderStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </p>
                </td>
                <td className="w-[20%] pl-6 py-4">
                  <p className="text-black font-regular text-[14px] leading-md">
                    {order.createdBy?.firstName} {order.createdBy?.lastName}
                  </p>
                  <p className="text-[12px] leading-sm text-grey pt-1">
                    <span className="text-[12px] font-medium text-grey">
                      {order.createdBy?._id}
                    </span>
                  </p>
                </td>
                <td className="w-[10%]">
                  {isUserAdmin(user) && (
                    <div className="hidden group-hover:block">
                      <div className="flex items-center justify-center gap-2">
                        {order.type.toLowerCase() !==
                          TYPE.SALES.toLowerCase() &&
                          order.status.toLowerCase() !==
                            STATUS.COMPLETED.toLowerCase() && (
                            <button
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-orange"
                              onClick={() =>
                                router.push(
                                  `/store/${user.store}/orders/edit-order/${order?._id}`
                                )
                              }
                            >
                              <img
                                src="/Edit.svg"
                                alt="Edit Icon for order"
                                className="w-[16px]"
                              />
                            </button>
                          )}
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFE9E9]"
                          onClick={() =>
                            setDeleteModal({
                              toggle: true,
                              data: order,
                            })
                          }
                        >
                          <img
                            src="/Delete.svg"
                            alt="Delete Icon for order"
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
              Orders
            </h3>
            <Button
              buttonText="Create Order"
              buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
              onClick={() =>
                router.push(`/store/${user.store}/orders/add-order`)
              }
            />
            <div className="ml-auto w-[350px]">
              <SearchInput
                type="text"
                id="search"
                name="search"
                placeholder="Search by product Name"
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
          heading="Delete Product"
          subHeading={`Are you sure you want to delete Order - ${deleteModal.data._id} for product ${deleteModal.data.product?.productName} Please keep in mind that these changes will not be reverted`}
          isLoading={deleteOrderLoading}
          onCancel={() =>
            setDeleteModal({
              toggle: false,
              data: {},
            })
          }
          onConfirm={() => handleDeleteOrder()}
        />
      )}
    </div>
  );
}
