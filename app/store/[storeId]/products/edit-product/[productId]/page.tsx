"use client";
import Input from "@/app/components/input";
import Sidebar from "@/app/components/sidebar";
import TopBar from "@/app/components/topbar";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ApiError from "@/app/components/api-error";
import Button from "@/app/components/button";
import { fetchData, putData } from "@/utils/fetch";
import Dropdown from "@/app/components/dropdown";
import FullPageLoading from "@/app/components/full-page-loading";
import { IProduct } from "../../interface";

export default function EditProduct({
  params,
}: {
  params: {
    productId: string;
  };
}) {
  const { productId } = params;
  const router = useRouter();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [product, setProduct] = useState<IProduct>({
    productName: "",
    strength: "",
    drugCode: "",
    price: "",
  });
  const [supplier, setSupplier] = useState({
    id: "",
    name: "",
  });
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<
    Array<{
      id: string;
      name: string;
    }>
  >([]);

  const [error, setError] = useState({
    productNameError: "",
    strengthError: "",
    drugCodeError: "",
    priceError: "",
    supplierError: "",
    apiError: "",
  });

  const { productName, price, strength, drugCode } = product;

  // call get product details api
  useEffect(() => {
    async function fetchSupplierDetails() {
      setPageLoading(true);
      try {
        const response = await fetchData(`/api/product/${productId}`);
        const { data } = response;
        setProduct(data);
        setSupplier({
          id: data.supplier._id,
          name: `${data.supplier.firstName} ${data.supplier.lastName}`,
        });
      } catch (error) {
      } finally {
        setPageLoading(false);
      }
    }

    fetchSupplierDetails();

    return () => {
      setPageLoading(false);
    };
  }, [productId]);

  // fetch all available suppliers here
  useEffect(() => {
    async function fetchAllSuppliers() {
      setSupplierLoading(true);
      try {
        const response = await fetchData(`/api/supplier`);
        const { data } = response;
        const filteredData = data.map((supplier: any) => ({
          id: supplier._id,
          name: `${supplier.firstName} ${supplier.lastName}`,
        }));
        setSuppliers([{ id: "", name: "Select a Supplier" }, ...filteredData]);
      } catch (error) {
      } finally {
        setSupplierLoading(false);
      }
    }

    fetchAllSuppliers();

    return () => {
      setSupplierLoading(false);
    };
  }, []);

  function checkProductName() {
    if (!productName) {
      setError((error) => ({
        ...error,
        productNameError: "Product Name is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      productNameError: "",
    }));
    return true;
  }

  function checkStrength() {
    if (!strength) {
      setError((error) => ({
        ...error,
        strengthError: "Strength is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      strengthError: "",
    }));
    return true;
  }

  function checkDrugCode() {
    if (!drugCode) {
      setError((error) => ({
        ...error,
        drugCodeError: "Drug Code is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      drugCodeError: "",
    }));
    return true;
  }

  function checkPrice() {
    if (!price) {
      setError((error) => ({
        ...error,
        priceError: "Price is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      priceError: "",
    }));
    return true;
  }

  function checkSupplier() {
    if (!supplier.name || !supplier.id) {
      setError((error) => ({
        ...error,
        supplierError: "Please Select a supplier for the product",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      supplierError: "",
    }));
    return true;
  }

  async function handleUpdateProduct() {
    const ALL_CHECKS_PASS = [
      checkProductName(),
      checkStrength(),
      checkDrugCode(),
      checkSupplier(),
      checkPrice(),
    ].every(Boolean);

    if (!ALL_CHECKS_PASS) return;

    setIsLoading(true);
    try {
      const response = await putData("/api/product", {
        productName,
        drugCode,
        strength,
        price: Number(price),
        supplierId: supplier.id,
        storeId: user?.store,
        productId,
      });
      const { data } = response;
      router.push(`/store/${data?.store}/products`);
    } catch (err: any) {
      setError((error) => ({
        ...error,
        apiError: err.message,
      }));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-start">
      <Sidebar />
      <div className="flex-1 h-screen overflow-auto">
        <TopBar />
        <div className="px-8 py-4">
          <h3 className="text-xl leading-xl text-black font-workSans pb-6">
            Edit Product
          </h3>
          {supplierLoading || pageLoading ? (
            <FullPageLoading
              wrapperClassName="h-[60vh] flex items-center justify-center"
              message="Fetching Details!"
            />
          ) : (
            <div className="bg-white w-[600px] border border-grey/45 shadow-card rounded-[16px] p-8">
              <form>
                <Input
                  type="text"
                  hasLabel
                  label="Product Name"
                  value={product.productName}
                  placeholder="Enter product name"
                  id="productName"
                  name="productName"
                  hasError={error.productNameError !== ""}
                  error={error.productNameError}
                  disabled={isLoading}
                  onChange={(event) =>
                    setProduct((product) => ({
                      ...product,
                      productName: event.target.value,
                    }))
                  }
                />
                <div className="flex items-center gap-4">
                  <div className="w-[50%]">
                    <Input
                      type="text"
                      hasLabel
                      label="Drug Code"
                      value={product.drugCode}
                      placeholder="Enter drug code"
                      id="drugCode"
                      name="drugCode"
                      hasError={error.drugCodeError !== ""}
                      error={error.drugCodeError}
                      disabled={isLoading}
                      onChange={(event) =>
                        setProduct((product) => ({
                          ...product,
                          drugCode: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="w-[50%]">
                    <Input
                      type="text"
                      hasLabel
                      label="Strength"
                      value={product.strength}
                      placeholder="Enter strength"
                      id="strength"
                      name="strength"
                      hasError={error.strengthError !== ""}
                      error={error.strengthError}
                      disabled={isLoading}
                      onChange={(event) =>
                        setProduct((product) => ({
                          ...product,
                          strength: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <Dropdown
                  defaultValue="Select Supplier"
                  id="supplier"
                  label="Select Supplier"
                  onClick={(value) => setSupplier(value)}
                  options={suppliers}
                  selectedOption={supplier}
                  hasError={error.supplierError !== ""}
                  error={error.supplierError}
                />
                <div className="flex items-center gap-4">
                  <div className="w-[50%]">
                    <Input
                      type="text"
                      hasLabel
                      label="Price"
                      value={product.price}
                      hasError={error.priceError !== ""}
                      error={error.priceError}
                      disabled={isLoading}
                      maxLength={10}
                      placeholder="Enter price"
                      id="price"
                      name="price"
                      onChange={(event) =>
                        setProduct((product) => ({
                          ...product,
                          price: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                {error.apiError && <ApiError errorMessage={error.apiError} />}
                <div className="pt-6 flex items-center gap-8">
                  <Button
                    buttonText="Cancel"
                    isDisabled={isLoading}
                    buttonClassName="rounded-md bg-transparent hover:bg-accent text-accent hover:text-white text-md leading-md font-medium"
                    onClick={() => router.push(`/store/${user.store}/products`)}
                  />
                  <Button
                    buttonText="Update Product"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
                    onClick={() => handleUpdateProduct()}
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
