"use client";
import Input from "@/app/components/input";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/topbar";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ApiError from "@/app/components/api-error";
import Button from "@/app/components/button";
import { fetchData, postData } from "@/utils/fetch";
import Dropdown from "@/app/components/dropdown";
import FullPageLoading from "@/app/components/full-page-loading";
import { IOrder } from "../interface";
import { IProduct } from "../../products/interface";
import RadioButton from "@/app/components/radio-button";
import { TYPE } from "@/constants/Order";
import { ICustomer } from "../../customers/interface";

export default function CreateOrder() {
  const router = useRouter();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [orderType, setOrderType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>({});
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    name: string;
  }>({
    id: "",
    name: "",
  });
  const [customers, setCustomers] = useState<
    Array<{
      id: string;
      name: string;
    }>
  >([]);
  const [fetchingProductLoading, setFetchingProductLoading] = useState(false);
  const [fetchingCustomerLoading, setFetchingCustomerLoading] = useState(false);

  const [error, setError] = useState({
    quantityError: "",
    productNameError: "",
    customerError: "",
    apiError: "",
  });

  const { productName } = selectedProduct;

  // fetch all available products here
  useEffect(() => {
    async function fetchAllProducts() {
      setFetchingProductLoading(true);
      try {
        const response = await fetchData(`/api/product?storeId=${user?.store}`);
        const { data } = response;
        setProducts([{ _id: "", productName: "Select a Product" }, ...data]);
      } catch (error) {
      } finally {
        setFetchingProductLoading(false);
      }
    }

    fetchAllProducts();

    return () => {
      setFetchingProductLoading(false);
    };
  }, []);

  // fetch all available customers here
  useEffect(() => {
    async function fetchAllCustomers() {
      setFetchingCustomerLoading(true);
      try {
        const response = await fetchData(
          `/api/customer?storeId=${user?.store}`
        );
        const { data } = response;
        const filteredData = data.map((customer: ICustomer) => ({
          id: customer._id,
          name: `${customer.firstName} ${customer.lastName}`,
        }));
        setCustomers([{ id: "", name: "Select a Customer" }, ...filteredData]);
      } catch (error) {
      } finally {
        setFetchingCustomerLoading(false);
      }
    }

    fetchAllCustomers();

    return () => {
      setFetchingCustomerLoading(false);
    };
  }, []);

  // check if the product is selected
  function checkProduct() {
    if (!productName) {
      setError((error) => ({
        ...error,
        productNameError: "Please Select a product",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      productNameError: "",
    }));
    return true;
  }

  function checkQuantity() {
    if (!quantity) {
      setError((error) => ({
        ...error,
        quantityError: "Quantity is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      quantityError: "",
    }));
    return true;
  }

  function checkCustomer() {
    if (
      orderType.toLowerCase() === TYPE.SALES.toLowerCase() &&
      (!selectedCustomer.id || !selectedCustomer.name)
    ) {
      setError((error) => ({
        ...error,
        customerError: "Please Select a customer",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      customerError: "",
    }));
    return true;
  }

  async function handleAddOrder() {
    if (orderType.toLowerCase() === TYPE.PURCHASE.toLowerCase()) {
      const ALL_CHECKS_PASS = [checkProduct(), checkQuantity()].every(Boolean);
      if (!ALL_CHECKS_PASS) return;
      setIsLoading(true);
      try {
        const response = await postData("/api/order/purchase-order", {
          productId: selectedProduct._id,
          quantity,
          supplierId: selectedProduct?.supplier?._id,
          storeId: user?.store,
          userId: user?._id,
        });
        const { data } = response;
        router.push(`/store/${data?.store}/orders`);
      } catch (err: any) {
        setError((error) => ({
          ...error,
          apiError: err.message,
        }));
      } finally {
        setIsLoading(false);
      }
    } else {
      const ALL_CHECKS_PASS = [
        checkProduct(),
        checkQuantity(),
        checkCustomer(),
      ].every(Boolean);

      if (!ALL_CHECKS_PASS) return;

      setIsLoading(true);
      try {
        const response = await postData("/api/order/sales-order", {
          productId: selectedProduct._id,
          quantity,
          customerId: selectedCustomer?.id,
          storeId: user?.store,
          userId: user?._id,
        });
        const { data } = response;
        router.push(`/store/${data?.store}/orders`);
      } catch (err: any) {
        setError((error) => ({
          ...error,
          apiError: err.message,
        }));
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="flex items-start">
      <Sidebar />
      <div className="flex-1 h-screen overflow-auto">
        <TopBar />
        <div className="px-8 py-4">
          <h3 className="text-xl leading-xl text-black font-workSans pb-6">
            Create Order
          </h3>
          <div className="bg-white rounded-16 border border-grey/45 shadow-card p-8 flex items-center gap-8 rounded-[16px] w-[600px] mb-6">
            <RadioButton
              buttonText="Purchase Order"
              isActive={
                orderType?.toLowerCase() === TYPE.PURCHASE.toLowerCase()
              }
              onClick={() => setOrderType(TYPE.PURCHASE)}
            />
            <RadioButton
              buttonText="Sales Order"
              isActive={orderType?.toLowerCase() === TYPE.SALES.toLowerCase()}
              onClick={() => setOrderType(TYPE.SALES)}
            />
          </div>
          {orderType !== "" ? (
            fetchingProductLoading || fetchingCustomerLoading ? (
              <FullPageLoading
                wrapperClassName="h-[60vh] flex items-center justify-center"
                message="Fetching all available suppliers to associate with product!"
              />
            ) : (
              <div className="bg-white w-[600px] border border-grey/45 shadow-card rounded-[16px] p-8">
                <form>
                  <Dropdown
                    id="selectProduct"
                    label="Select Product"
                    onClick={(value) => {
                      const product: any = products.find(
                        (product) => product._id === value.id
                      );
                      setSelectedProduct(product);
                    }}
                    options={products?.map(
                      ({ _id = "", productName = "" }) => ({
                        id: _id,
                        name: productName,
                      })
                    )}
                    selectedOption={{
                      id: selectedProduct._id || "",
                      name: selectedProduct.productName || "",
                    }}
                    hasError={error.productNameError !== ""}
                    error={error.productNameError}
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-[50%]">
                      <Input
                        type="text"
                        hasLabel
                        label="Drug Code"
                        value={selectedProduct?.drugCode}
                        placeholder="Enter drug code"
                        id="drugCode"
                        name="drugCode"
                        disabled
                      />
                    </div>
                    <div className="w-[50%]">
                      <Input
                        type="text"
                        hasLabel
                        label="Strength"
                        placeholder="Enter strength"
                        id="strength"
                        name="strength"
                        value={selectedProduct.strength}
                        disabled
                      />
                    </div>
                  </div>
                  {orderType.toLowerCase() === TYPE.PURCHASE.toLowerCase() ? (
                    <Dropdown
                      id="supplier"
                      label="Select Supplier"
                      options={[
                        {
                          id: "",
                          name: "Select a Supplier",
                        },
                        {
                          id: `${selectedProduct?.supplier?._id}` ?? "",
                          name:
                            `${selectedProduct?.supplier?.firstName} ${selectedProduct?.supplier?.lastName}` ??
                            "",
                        },
                      ]}
                      selectedOption={{
                        id: selectedProduct?.supplier?._id ?? "",
                        name: selectedProduct?.supplier
                          ? `${selectedProduct?.supplier?.firstName} ${selectedProduct?.supplier?.lastName}`
                          : "",
                      }}
                      isDisabled
                    />
                  ) : (
                    <Dropdown
                      defaultValue="Select Customer"
                      id="customer"
                      label="Select Customer"
                      onClick={(value) => {
                        setSelectedCustomer(value);
                      }}
                      options={customers}
                      selectedOption={selectedCustomer}
                      hasError={error.customerError !== ""}
                      error={error.customerError}
                    />
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-[50%]">
                      <Input
                        type="text"
                        hasLabel
                        label="Quantity"
                        hasError={error.quantityError !== ""}
                        error={error.quantityError}
                        disabled={isLoading}
                        maxLength={10}
                        placeholder="Enter Quantity"
                        id="quantity"
                        name="quantity"
                        onChange={(event) => setQuantity(event.target.value)}
                      />
                    </div>
                    <div className="w-[50%]">
                      <Input
                        type="text"
                        hasLabel
                        label="Amount"
                        disabled
                        value={
                          Number(selectedProduct?.price) * Number(quantity) || 0
                        }
                        maxLength={10}
                        placeholder="Enter amount"
                        id="amount"
                        name="amount"
                      />
                    </div>
                  </div>
                  {error.apiError && <ApiError errorMessage={error.apiError} />}
                  <div className="pt-6 flex items-center gap-8">
                    <Button
                      buttonText="Cancel"
                      isDisabled={isLoading}
                      buttonClassName="rounded-md bg-transparent hover:bg-accent text-accent hover:text-white text-md leading-md font-medium"
                      onClick={() => router.push(`/store/${user.store}/orders`)}
                    />
                    <Button
                      buttonText="Create Order"
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
                      onClick={() => handleAddOrder()}
                    />
                  </div>
                </form>
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
