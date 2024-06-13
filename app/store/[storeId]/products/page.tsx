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
import { IProduct } from "./interface";
import { deleteData, fetchData } from "@/utils/fetch";
import FullPageLoading from "@/app/components/full-page-loading";
import EmptyState from "@/app/components/empty-state";
import moment from "moment";
import DeleteModal from "@/app/components/delete-modal";
import Link from "next/link";

export default function Products() {
  const router = useRouter();
  const { user } = useUserContext();

  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [successDeleteMessage, setSuccessDeleteMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    toggle: boolean;
    data: IProduct;
  }>({
    toggle: false,
    data: {},
  });
  const [error, setError] = useState({
    apiError: "",
  });

  const fetchAllProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchData(`/api/product?storeId=${user?.store}`);
      const { data } = response;
      setProducts(data);
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
    fetchAllProducts();

    return () => {
      setIsLoading(false);
    };
  }, [fetchAllProducts]);

  // delete product api call
  async function handleDeleteProduct() {
    setDeleteProductLoading(true);
    try {
      const response = await deleteData("/api/product", {
        productId: deleteModal.data._id,
        storeId: user?.store,
      });
      const { message } = response;
      setSuccessDeleteMessage(message);
      setDeleteModal({
        toggle: false,
        data: {},
      });
      fetchAllProducts();
    } catch (err: any) {
      setError((error) => ({
        ...error,
        apiError: err.message,
      }));
    } finally {
      setDeleteProductLoading(false);
    }
  }

  function renderLoadingOrTable() {
    if (isLoading) {
      return (
        <FullPageLoading
          wrapperClassName="h-[60vh] flex items-center justify-center"
          message="Fetching Product List!"
        />
      );
    }

    if (products?.length <= 0) {
      return (
        <EmptyState wrapperClassName="h-[60vh] flex items-center justify-center" />
      );
    }

    return (
      <div className="rounded-[16px] overflow-hidden bg-white border border-neutral-200 shadow-table">
        <table className="w-full bg-white rounded-[16px]">
          <thead>
            <tr className="bg-blue w-full rounded-t-2xl">
              <th className="w-[13%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Drug Code
              </th>
              <th className="w-[25%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Product Name
              </th>
              <th className="w-[10%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Strength
              </th>
              <th className="w-[12%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Quantity
              </th>
              <th className="w-[10%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Price
              </th>
              <th className="w-[20%] pl-6 py-4 text-black font-medium text-sm leading-s, text-left">
                Supplier
              </th>
              <th className="w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product: any) => (
              <tr
                className="bg-white border-t border-neutral-200 group"
                key={product._id}
              >
                <td className="w-[13%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  {product.drugCode}
                </td>
                <td className="w-[25%] pl-6 py-4">
                  <p className="text-black font-regular text-[14px] leading-md">
                    {product.productName}
                  </p>
                  <p className="text-[12px] leading-sm text-grey pt-1">
                    Added on
                    <span className="pl-1 text-[12px] font-medium text-black">
                      {moment(product.createdAt).format("YYYY/MM/DD")}
                    </span>
                  </p>
                </td>
                <td className="w-[10%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  {product.strength}
                </td>
                <td className={`w-[12%] pl-6 py-4`}>
                  <div>
                    <p
                      className={`text-[14px] leading-md ${
                        product?.quantity < 10
                          ? "text-error font-medium"
                          : "text-black font-regular "
                      }`}
                    >
                      {product.quantity} units
                    </p>
                    {product?.quantity < 10 && (
                      <Link
                        href={`/store/${user.store}/add-order`}
                        className="px-2 py-1 rounded-full text-[10px] text-white font-bold bg-accent"
                      >
                        Add Order
                      </Link>
                    )}
                  </div>
                </td>
                <td className="w-[10%] pl-6 py-4 text-black font-regular text-[14px] leading-md">
                  $ {Number(product.price).toFixed(2)}
                </td>
                <td className="w-[20%] pl-6 py-4">
                  <p className="text-black font-regular text-[14px] leading-md">
                    {product.supplier?.firstName} {product.supplier?.lastName}
                  </p>
                  <p className="text-[12px] leading-sm text-grey pt-1">
                    <span className="text-[12px] font-medium text-grey">
                      {product.supplier?._id}
                    </span>
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
                              `/store/${user.store}/products/edit-product/${product?._id}`
                            )
                          }
                        >
                          <img
                            src="/Edit.svg"
                            alt="Edit Icon for product"
                            className="w-[16px]"
                          />
                        </button>
                        <button
                          className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFE9E9]"
                          onClick={() =>
                            setDeleteModal({
                              toggle: true,
                              data: product,
                            })
                          }
                        >
                          <img
                            src="/Delete.svg"
                            alt="Delete Icon for product"
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
              Products
            </h3>
            {isUserAdmin(user) && (
              <Button
                buttonText="Add Product"
                buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
                onClick={() =>
                  router.push(`/store/${user.store}/products/add-product`)
                }
              />
            )}
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
          subHeading={`Are you sure you want to delete "${deleteModal.data.productName}" from your products's List. Please keep in mind that these changes will not be reverted`}
          isLoading={deleteProductLoading}
          onCancel={() =>
            setDeleteModal({
              toggle: false,
              data: {},
            })
          }
          onConfirm={() => handleDeleteProduct()}
        />
      )}
    </div>
  );
}
