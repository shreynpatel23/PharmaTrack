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
  try {
    const response = await axios.post(url, body, {
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
