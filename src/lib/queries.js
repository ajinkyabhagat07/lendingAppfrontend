import axios from "axios";
import { verifyToken } from "./users";

export const createQuery = async (queryData, email) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const verifyToekn = await verifyToken();

    if (!verifyToekn) {
      throw new Error("Unauthorized: Invalid token");
    }

    const formData = {
      userId: queryData.userId,
      title: queryData.title,
      description: queryData.description,
      email: email,
    };

    const response = await axios.post(
      "http://localhost:4000/api/v1/query/create",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Error signing up:", error);
    throw new Error("Failed to signup. Please try again.");
  }
};

export const getQueries = async (id) => {
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
      `http://localhost:4000/api/v1/user/getAll?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          include: "queries",
        },
      }
    );

    return res.data[0].queries;
  } catch (error) {
    console.log("Error fetching loans:", error);
  }
};

export const getAllQueries = async (filterParams, limit, page) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const verifyToekn = await verifyToken();

    if (!verifyToekn) {
      throw new Error("Unauthorized: Invalid token");
    }

    const response = await axios.get(
      "http://localhost:4000/api/v1/query/getAll",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ...filterParams,
          limit,
          page,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteQuery = async (queryId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const verifyToekn = await verifyToken();

    if (!verifyToekn) {
      throw new Error("Unauthorized: Invalid token");
    }

    const response = await axios.delete(
      `http://localhost:4000/api/v1/query/delete?id=${queryId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateQueryRemark = async (queryId, data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const verifyToekn = await verifyToken();

    if (!verifyToekn) {
      throw new Error("Unauthorized: Invalid token");
    }

    const response = await axios.put(
      `http://localhost:4000/api/v1/query/update?id=${queryId}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating query remark:", error);
    throw new Error("Failed to update query remark. Please try again.");
  }
};
