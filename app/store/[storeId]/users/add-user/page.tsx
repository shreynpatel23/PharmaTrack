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
import { IUser } from "../interface";
import Dropdown from "@/app/components/dropdown";
import FullPageLoading from "@/app/components/full-page-loading";

export default function AddUser() {
  const router = useRouter();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<IUser>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [selectedRole, setSelectedRole] = useState({
    id: "",
    name: "",
  });
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roles, setRoles] = useState<
    Array<{
      id: string;
      name: string;
    }>
  >([]);

  const [error, setError] = useState({
    emailError: "",
    firstNameError: "",
    lastNameError: "",
    phoneNumberError: "",
    passwordError: "",
    roleError: "",
    apiError: "",
  });

  const { firstName, lastName, email, phoneNumber, password } = userData;

  // fetch all available roles here
  useEffect(() => {
    async function fetchAllRoles() {
      setRolesLoading(true);
      try {
        const response = await fetchData(`/api/roles`);
        const { data } = response;
        const filteredData = data.map((role: any) => ({
          id: role._id,
          name: role.name,
        }));
        setRoles([{ id: "", name: "Select a Role" }, ...filteredData]);
      } catch (error) {
      } finally {
        setRolesLoading(false);
      }
    }

    fetchAllRoles();

    return () => {
      setRolesLoading(false);
    };
  }, []);

  function checkEmail() {
    if (!email) {
      setError((error) => ({
        ...error,
        emailError: "Email is required",
      }));
      return false;
    }
    if (!email.includes("@")) {
      setError((error) => ({
        ...error,
        emailError: "Please enter a valid email",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      emailError: "",
    }));
    return true;
  }

  function checkPassword() {
    if (!password) {
      setError((error) => ({
        ...error,
        passwordError: "Password is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      passwordError: "",
    }));
    return true;
  }

  function checkFirstName() {
    if (!firstName) {
      setError((error) => ({
        ...error,
        firstNameError: "First Name is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      firstNameError: "",
    }));
    return true;
  }

  function checkLastName() {
    if (!lastName) {
      setError((error) => ({
        ...error,
        lastNameError: "Last Name is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      lastNameError: "",
    }));
    return true;
  }

  function checkPhoneNumber() {
    if (!phoneNumber) {
      setError((error) => ({
        ...error,
        phoneNumberError: "Phone Number is required",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      phoneNumberError: "",
    }));
    return true;
  }

  function checkRole() {
    if (!selectedRole.name || !selectedRole.id) {
      setError((error) => ({
        ...error,
        roleError: "Please Select a role for the user",
      }));
      return false;
    }
    setError((error) => ({
      ...error,
      roleError: "",
    }));
    return true;
  }

  async function handleAddUser() {
    const ALL_CHECKS_PASS = [
      checkEmail(),
      checkPassword(),
      checkFirstName(),
      checkLastName(),
      checkPhoneNumber(),
      checkRole(),
    ].every(Boolean);

    if (!ALL_CHECKS_PASS) return;

    setIsLoading(true);
    try {
      const response = await postData("/api/users", {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        roleId: selectedRole?.id,
        storeId: user?.store,
      });
      const { data } = response;
      router.push(`/store/${data?.store}/users`);
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
            Add User
          </h3>
          {rolesLoading ? (
            <FullPageLoading
              wrapperClassName="h-[60vh] flex items-center justify-center"
              message="Fetching all available roles!"
            />
          ) : (
            <div className="bg-white w-[600px] border border-grey/45 shadow-card rounded-[16px] p-8">
              <form>
                <div className="flex items-center gap-4">
                  <div className="w-[50%]">
                    <Input
                      type="text"
                      hasLabel
                      label="First Name"
                      placeholder="Enter user's first name"
                      id="firstName"
                      name="firstName"
                      hasError={error.firstNameError !== ""}
                      error={error.firstNameError}
                      disabled={isLoading}
                      onChange={(event) =>
                        setUserData((user) => ({
                          ...user,
                          firstName: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="w-[50%]">
                    <Input
                      type="text"
                      hasLabel
                      label="Last Name"
                      placeholder="Enter user's last name"
                      id="lastName"
                      name="lastName"
                      hasError={error.lastNameError !== ""}
                      error={error.lastNameError}
                      disabled={isLoading}
                      onChange={(event) =>
                        setUserData((user) => ({
                          ...user,
                          lastName: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <Input
                  type="email"
                  hasLabel
                  label="Email"
                  hasError={error.emailError !== ""}
                  error={error.emailError}
                  disabled={isLoading}
                  placeholder="Enter user's email"
                  id="userEmail"
                  name="userEmail"
                  onChange={(event) =>
                    setUserData((user) => ({
                      ...user,
                      email: event.target.value,
                    }))
                  }
                />
                <div className="flex items-center gap-4">
                  <div className="w-[50%]">
                    <Input
                      type="password"
                      hasLabel
                      label="Password"
                      placeholder="Enter user's password"
                      id="password"
                      name="password"
                      hasError={error.passwordError !== ""}
                      error={error.passwordError}
                      disabled={isLoading}
                      onChange={(event) =>
                        setUserData((user) => ({
                          ...user,
                          password: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="w-[50%]">
                    <Input
                      type="text"
                      hasLabel
                      label="Phone Number"
                      hasError={error.phoneNumberError !== ""}
                      error={error.phoneNumberError}
                      disabled={isLoading}
                      maxLength={10}
                      placeholder="Enter user's phone"
                      id="phoneNumber"
                      name="phoneNumber"
                      onChange={(event) =>
                        setUserData((user) => ({
                          ...user,
                          phoneNumber: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <Dropdown
                  defaultValue="Select Role"
                  id="role"
                  label="Select Role"
                  onClick={(value) => setSelectedRole(value)}
                  options={roles}
                  selectedOption={selectedRole}
                  hasError={error.roleError !== ""}
                  error={error.roleError}
                />
                {error.apiError && <ApiError errorMessage={error.apiError} />}
                <div className="pt-6 flex items-center gap-8">
                  <Button
                    buttonText="Cancel"
                    isDisabled={isLoading}
                    buttonClassName="rounded-md bg-transparent hover:bg-accent text-accent hover:text-white text-md leading-md font-medium"
                    onClick={() => router.push(`/store/${user.store}/users`)}
                  />
                  <Button
                    buttonText="Add User"
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white text-md leading-md"
                    onClick={() => handleAddUser()}
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
