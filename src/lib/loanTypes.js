import axios from "axios";
import { verifyToken } from "./users";

export const getAllLoanTypes = async (filterParams, limit, page) => {
  try {
    let res = await axios.get(`http://localhost:4000/api/v1/user/loantype`, {
      params: {
        ...filterParams,
        limit,
        page,
      },
    });

    return res.data;
  } catch (error) {
    console.log("Error fetching loan types:", error);
  }
};

export const createLoanType = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const verifyToekn = await verifyToken();

    if (!verifyToekn) {
      throw new Error("Unauthorized: Invalid token");
    }

    const response = await axios.post(
      "http://localhost:4000/api/v1/user/loantype",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteLoanType = async (id) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const verifyToekn = await verifyToken();

    if (!verifyToekn) {
      throw new Error("Unauthorized: Invalid token");
    }

    const response = await axios.delete(
      `http://localhost:4000/api/v1/user/loantype?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const updateLoanType = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const verifyToekn = await verifyToken();

    if (!verifyToekn) {
      throw new Error("Unauthorized: Invalid token");
    }

    const response = await axios.put(
      `http://localhost:4000/api/v1/user/loantype/?id=${id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          loanName: formData.loanName,
          interestRate: formData.interestRate,
          eligibilityCriteria: formData.eligibilityCriteria,
          minAmount: formData.minAmount,
          maxAmount: formData.maxAmount,
          minRepayTenure: formData.minRepayTenure,
          maxRepayTenure: formData.maxRepayTenure,
          requiredDocuments: formData.requiredDocuments,
          minAge: formData.minAge,
          minSalary: formData.minSalary,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Failed to update loan type:", error);
  }
};
