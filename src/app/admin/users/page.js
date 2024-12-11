"use client";

import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { FaInfoCircle, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { deleteUser, getAllusers, updateUser, verifyToken } from "@/lib/users";
import ItemsPerPageSelector from "@/components/ItemPerPageSelector";
import Pagination from "@/components/Pagination";
import { toast } from "react-hot-toast";
import formatDate from "@/utils/formatdate";
import { generateAndDownloadCSV } from "@/utils/generateAndDownloadCSV";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [editFormData, setEditFormData] = useState({
    profileImageUrl: "",
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
  });
  const [searchFilters, setSearchFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const fieldsToDisplay = [
    { key: "id", label: "ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
  ];
  const fieldsToDisplayForCSV = ["id", "userName" ,"firstName", "lastName", "email" , "phoneNumber" , "gender" , "dateOfBirth" , "profileImageUrl"];

  const fetchUsers = async (filters = {}) => {
    try {
      const fetchedUsers = await getAllusers(filters, limit, page);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [limit, page]);

  const handleFilterChange = (key, value) => {
    setSearchFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitFilters = async () => {
    const filters = {
      firstName: searchFilters.firstName,
      lastName: searchFilters.lastName,
      email: searchFilters.email,
    };

    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value)
    );

    await fetchUsers(validFilters);
  };

  const handleDetailsClick = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    console.log(user);
    setEditFormData({
      profileImageUrl: user.profileImageUrl || "",
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedUser(id); // Store only the user ID
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser.id, editFormData);
      fetchUsers();
      toast.success("User updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user.");
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) {
      toast.error("No user selected for deletion.");
      return;
    }

    try {
      let res = await deleteUser(selectedUser);
      if (res) {
        toast.success("user deleted succesfully");
      } else {
        toast.error("Failed to delete user.");
      }
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser)); // Update UI
      setIsDeleteModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const fileSize = 50000; 
  
      const allUsers = await getAllusers(); 
  
      if (!allUsers || allUsers.length === 0) {
        toast.error("No users available for download.");
        return;
      }
  
      const files = [];
      for (let i = 0; i < allUsers.length; i += fileSize) {
        files.push(allUsers.slice(i, i + fileSize));
      }
  
      await Promise.all(
        files.map((file, index) => generateAndDownloadCSV(file, index + 1 , fieldsToDisplayForCSV))
      );
  
      toast.success("CSV files downloaded successfully!");
    } catch (error) {

      toast.error("Failed to download CSV files.");
    }
  };
  
  
  

  const header = (
    <>
      {fieldsToDisplay.map((field, index) => (
        <th
          key={index}
          className={`px-6 py-3 text-left border-l border-gray-200 last:border-r uppercase ${
            field.key === "id" ? "min-w-[50px] text-center" : "min-w-[150px]"
          }`}
        >
          {field.label}
        </th>
      ))}
      <th className="px-6 py-3 text-center min-w-[100px] border-l border-gray-200 uppercase">
        Details
      </th>
      <th className="px-6 py-3 text-center min-w-[100px] border-l border-gray-200 uppercase">
        Edit
      </th>
      <th className="px-6 py-3 text-center min-w-[100px] border-l border-gray-200 uppercase">
        Delete
      </th>
    </>
  );

  const tableData = users.map((user, index) => (
    <tr
      key={user.id || index}
      className="hover:bg-gray-100 border-b last:border-b-0"
    >
      {fieldsToDisplay.map((keyName, cellIndex) => (
        <td
          key={cellIndex}
          className={`px-6 py-4 border-l border-gray-200 text-gray-700 last:border-r ${
            keyName.key === "id" ? "min-w-[50px] text-center" : "min-w-[150px]"
          }`}
        >
          {keyName.key === "id" ? index + 1 + (page - 1) * limit: user[keyName.key]}
        </td>
      ))}
      <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
        <FaInfoCircle
          className="text-blue-600 cursor-pointer hover:text-blue-800"
          onClick={() => handleDetailsClick(user)}
          title="View Details"
        />
      </td>
      <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
        <FaEdit
          className="text-green-600 cursor-pointer hover:text-green-800"
          onClick={() => handleEditClick(user)}
          title="Edit"
        />
      </td>
      <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
        <FaTrash
          className="text-red-600 cursor-pointer hover:text-red-800"
          onClick={() => handleDeleteClick(user.id)}
          title="Delete"
        />
      </td>
    </tr>
  ));

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Users</h2>
        <ItemsPerPageSelector setLimit={setLimit} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <SearchBar
          label="First Name"
          value={searchFilters.firstName}
          onChange={(value) => handleFilterChange("firstName", value)}
          placeholder="Search by First Name"
        />
        <SearchBar
          label="Last Name"
          value={searchFilters.lastName}
          onChange={(value) => handleFilterChange("lastName", value)}
          placeholder="Search by Last Name"
        />
        <SearchBar
          label="Email"
          value={searchFilters.email}
          onChange={(value) => handleFilterChange("email", value)}
          placeholder="Search by Email"
        />
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={handleDownloadCSV}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
        >
          <FaDownload className="mr-2" />
          Download CSV
        </button>
        <button
          onClick={handleSubmitFilters}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          Apply Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white text-sm uppercase tracking-wider">
              {header}
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData
            ) : (
              <tr>
                <td
                  colSpan={fieldsToDisplay.length + 3}
                  className="text-center py-4 text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} setPage={setPage} />
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-blue-700">
              User Details
            </h3>
            <img
              src={selectedUser.profileImageUrl}
              alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <p>
              <strong>User Name:</strong> {selectedUser.userName}
            </p>
            <p>
              <strong>First Name:</strong> {selectedUser.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {selectedUser.lastName}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedUser.phoneNumber}
            </p>
            <p>
              <strong>Gender:</strong> {selectedUser.gender}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {formatDate(selectedUser.dateOfBirth)}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-red-700">
              Confirm Delete
            </h3>
            <p>Are you sure you want to delete this loan type?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
            <h3 className="text-lg font-bold text-green-600 mb-4 text-center">
              Edit User
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="profileImageUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Profile Image URL
                  </label>
                  <input
                    id="profileImageUrl"
                    name="profileImageUrl"
                    type="text"
                    value={editFormData.profileImageUrl}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        profileImageUrl: e.target.value,
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    User Name
                  </label>
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    value={editFormData.userName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        userName: e.target.value,
                      })
                    }
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        firstName: e.target.value,
                      })
                    }
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        lastName: e.target.value,
                      })
                    }
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={editFormData.phoneNumber}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={editFormData.gender}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        gender: e.target.value,
                      })
                    }
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={editFormData.dateOfBirth}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        dateOfBirth: e.target.value,
                      })
                    }
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
