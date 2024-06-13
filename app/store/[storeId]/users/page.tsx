"use client";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/topbar";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { IUser } from "./interface";
import { deleteData, fetchData } from "@/utils/fetch";
import FullPageLoading from "@/app/components/full-page-loading";
import EmptyState from "@/app/components/empty-state";
import moment from "moment";
import { isUserOwner } from "@/utils/checkProtectedRoutes";
import Button from "@/app/components/button";
import SearchInput from "@/app/components/search";
import ApiError from "@/app/components/api-error";
import ApiSuccess from "@/app/components/api-success";
import DeleteModal from "@/app/components/delete-modal";

export default function Users() {
  const router = useRouter();
  const { user } = useUserContext();

  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [successDeleteMessage, setSuccessDeleteMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    toggle: boolean;
    data: IUser;
  }>({
    toggle: false,
    data: {},
  });
  const [error, setError] = useState({
    apiError: "",
  });

  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchData(`/api/users?storeId=${user?.store}`);
      const { data } = response;
      setUsers(data);
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
    fetchAllUsers();

    return () => {
      setIsLoading(false);
    };
  }, [fetchAllUsers]);

  // delete user api call
  async function handleDeleteUser() {
    setDeleteUserLoading(true);
    try {
      const response = await deleteData("/api/users", {
        userId: deleteModal.data._id,
        storeId: user?.store,
      });
      const { message } = response;
      setSuccessDeleteMessage(message);
      setDeleteModal({
        toggle: false,
        data: {},
      });
      fetchAllUsers();
    } catch (err: any) {
      setError((error) => ({
        ...error,
        apiError: err.message,
      }));
    } finally {
      setDeleteUserLoading(false);
    }
  }

  function renderLoadingOrTable() {
    if (isLoading) {
      return (
        <FullPageLoading
          wrapperClassName="h-[60vh] flex items-center justify-center"
          message="Fetching Users List!"
        />
      );
    }

    if (users?.length <= 0) {
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
                Full Name
              </th>
              <th className="w-[20%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Email
              </th>
              <th className="w-[15%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Phone
              </th>
              <th className="w-[15%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Status
              </th>
              <th className="w-[15%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Role
              </th>
              <th className="w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((userData) => (
              <tr
                className="bg-white border-t border-neutral-200 group"
                key={userData._id}
              >
                <td className="w-[25%] pl-6 py-4">
                  <p className="text-black font-regular text-[14px] leading-md">
                    {userData.firstName} {userData.lastName}
                  </p>
                  <p className="text-[12px] leading-sm text-grey pt-1">
                    Added on
                    <span className="pl-1 text-[12px] font-medium text-black">
                      {moment(userData.createdAt).format("YYYY/MM/DD")}
                    </span>
                  </p>
                </td>
                <td className="w-[20%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  {userData.email}
                </td>
                <td className="w-[15%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  +1 {userData.phoneNumber}
                </td>
                <td className="w-[15%] pl-6 py-4">
                  <div
                    className={`px-4 py-2 rounded-full font-medium text-[12px] leading-md inline ${
                      userData.status
                        ? "text-success bg-[#E4FAE5]"
                        : "text-error bg-[#FFE9E9]"
                    }`}
                  >
                    {userData.status ? "Active" : "Inactive"}
                  </div>
                </td>
                <td className="w-[15%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  {userData.role?.name}
                </td>
                <td className="w-[10%]">
                  {isUserOwner(user) && (
                    <div className="hidden group-hover:block">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-orange"
                          onClick={() =>
                            router.push(
                              `/store/${user.store}/users/edit-user/${userData?._id}`
                            )
                          }
                        >
                          <img
                            src="/Edit.svg"
                            alt="Edit Icon for user"
                            className="w-[16px]"
                          />
                        </button>
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFE9E9]"
                          onClick={() =>
                            setDeleteModal({
                              toggle: true,
                              data: userData,
                            })
                          }
                        >
                          <img
                            src="/Delete.svg"
                            alt="Delete Icon for user"
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
              Users
            </h3>
            {isUserOwner(user) && (
              <Button
                buttonText="Add User"
                buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
                onClick={() =>
                  router.push(`/store/${user.store}/users/add-user`)
                }
              />
            )}
            <div className="ml-auto w-[350px]">
              <SearchInput
                type="text"
                id="search"
                name="search"
                placeholder="Search by user Name"
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
          heading="Delete User"
          subHeading={`Are you sure you want to delete "${deleteModal.data.firstName} ${deleteModal.data.lastName}" from your User's List. Please keep in mind that these changes will not be reverted`}
          isLoading={deleteUserLoading}
          onCancel={() =>
            setDeleteModal({
              toggle: false,
              data: {},
            })
          }
          onConfirm={() => handleDeleteUser()}
        />
      )}
    </div>
  );
}
