import axios from "axios";
import { verifyToken } from "./users";

export const getAllEmis = async (filterParams, limit, page) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const verifyToekn = await verifyToken();

    if (!verifyToekn) {
      throw new Error("Unauthorized: Invalid token");
    }

    let res = await axios.get(`http://localhost:4000/api/v1/user/loan`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ...filterParams,
        include: "emis",
        limit,
        page,
      },
    });

    return res.data;
  } catch (error) {
    console.log("Error fetching loans:", error);
  }
};

export const getAllEmisofUser = async (id, filterParams, limit, page) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const verifyToekn = await verifyToken();

    if (!verifyToekn) {
      throw new Error("Unauthorized: Invalid token");
    }

    let res = await axios.get(
      `http://localhost:4000/api/v1/user/loan?customerId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...filterParams,
          include: "emis",
          limit,
          page,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log("Error fetching loans:", error);
  }
};

export const payEmi = async (id) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const verifyToekn = await verifyToken();

    if (!verifyToekn) {
      throw new Error("Unauthorized: Invalid token");
    }

    let res = await axios.put(
      `http://localhost:4000/api/v1/user/payemi?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error while processing EMI payment:", error);
    throw new Error("Failed to process EMI payment. Please try again.");
  }
};
