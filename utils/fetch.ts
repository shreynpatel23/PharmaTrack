import axios from "axios";

export async function fetchData(url: string) {
  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { data } = response;
    return data;
  } catch (err: any) {
    const { data } = err.response;
    throw new Error(data?.message || "Error in making API Call");
  }
}

export async function postData(url: string, body: any) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const { data } = response;
    return data;
  } catch (err: any) {
    const { data } = err.response;
    throw new Error(data?.message || "Error in making API Call");
  }
}

export async function putData(url: string, body: any) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  try {
    const response = await axios.put(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const { data } = response;
    return data;
  } catch (err: any) {
    const { data } = err.response;
    throw new Error(data?.message || "Error in making API Call");
  }
}

export async function deleteData(url: string, body: any) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  try {
    const response = await axios.delete(url, {
      data: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const { data } = response;
    return data;
  } catch (err: any) {
    const { data } = err.response;
    throw new Error(data?.message || "Error in making API Call");
  }
}
