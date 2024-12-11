import axios from "axios";
import { verifyToken } from "./users";

export const LoanEntry = async (formData) => {
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
      "http://localhost:4000/api/v1/user/loan",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);

    return response;
  } catch (error) {
    throw error;
  }
};

export const getAppliedLoans = async (filterParams, limit, page) => {
  try {
    const token = localStorage.getItem("token");
    console.log(filterParams);

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
        limit,
        page,
        include: ["emis"],
      },
    });

    return res.data;
  } catch (error) {
    console.log("Error fetching loans:", error);
  }
};

export const getAppliedLoansStatus = async (filterParams, limit, page) => {
  try {
    const token = localStorage.getItem("token");
    console.log(filterParams);

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
        limit,
        page,
      },
    });

    return res.data;
  } catch (error) {
    console.log("Error fetching loans:", error);
  }
};

export const getAllAppliedLoansOfUser = async (userId, limit, page) => {
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
      `http://localhost:4000/api/v1/user/getById/?id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          include: "loans",
          limit,
          page,
        },
      }
    );

    //console.log(res.data);

    return res.data.loans;
  } catch (error) {
    console.log("Error fetching loans:", error);
  }
};

export const getUserLoans = async (userId) => {
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
      `http://localhost:4000/api/v1/user/getById/?id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveLoan = async (id, formData) => {
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
      `http://localhost:4000/api/v1/user/approveloan?id=${id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          loanStatus: formData.loanStatus,
          approvedDate: formData.approvedDate,
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const rejectLoan = async (id, formData) => {
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
      `http://localhost:4000/api/v1/user/rejectloan?id=${id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          loanStatus: formData.loanStatus,
          reasonForRejection: formData.reasonForRejection,
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};
