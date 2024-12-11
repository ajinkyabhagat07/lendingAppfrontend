import axios from "axios";
import Cookies from "js-cookie";

export const handleUserLogin = async (formData) => {
  const loginData = {
    userName: formData.userName,
    password: formData.password,
  };

  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/user/login",
      loginData
    );
    if (response) {
      localStorage.setItem("token", response.data);
      //console.log(response.data);
      const tokenWithBearer = response?.data;
      const token = tokenWithBearer.slice(7);

      Cookies.set("token", token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
    }

    return response.data;
  } catch (error) {
    console.log("Error logging in", error);
  }
};

export const verifyToken = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const data = { token: token };

    const response = await axios.post(
      `http://localhost:4000/api/v1/user/verifytoken`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitSignUp = async (formData) => {
  try {
    const signUpData = {
      userName: formData.userName,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      profileImageUrl: formData.profileImageUrl,
      isAdmin: formData.isAdmin,
    };

    // console.log(signUpData);

    const response = await axios.post(
      "http://localhost:4000/api/v1/user/createUser",
      signUpData
    );

    return response.data;
  } catch (error) {
    console.log("Error signing up:", error);
    throw new Error("Failed to signup. Please try again.");
  }
};

export const getprofileData = async (userId) => {
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

    // console.log(response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllusers = async (filterParams, limit, page) => {
  try {
    let token = localStorage.getItem("token");

    // console.log(page);
    // console.log(limit);

    if (!token) {
      throw new Error("Unauthorized error");
    }

    const verifyToekn = await verifyToken();

    if (!verifyToekn) {
      throw new Error("Unauthorized: Invalid token");
    }

    let res = await axios.get(`http://localhost:4000/api/v1/user/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ...filterParams,
        limit,
        page,
      },
    });
    //console.log(res);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log("Error fetching users:", error);
  }
};

export const deleteUser = async (id) => {
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
      `http://localhost:4000/api/v1/user/delete?id=${id}`,
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

export const updateUser = async (id, formData) => {
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
      `http://localhost:4000/api/v1/user/update?id=${id}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          profileImageUrl: formData.profileImageUrl,
          userName: formData.userName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Failed to update loan type:", error);
  }
};
