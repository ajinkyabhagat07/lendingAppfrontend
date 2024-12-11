"use client";

import React, { useEffect, useState } from "react";
import {
  deleteLoanType,
  getAllLoanTypes,
  updateLoanType,
} from "@/lib/loanTypes";
import SearchBar from "@/components/SearchBar";
import { FaInfoCircle, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import ItemsPerPageSelector from "@/components/ItemPerPageSelector";
import Pagination from "@/components/Pagination";
import { toast } from "react-hot-toast";
import { generateAndDownloadCSV } from "@/utils/generateAndDownloadCSV";

const LoanTypes = () => {
  const [loanTypes, setLoanTypes] = useState([]);
  const [selectedLoanType, setSelectedLoanType] = useState(null); // For details modal data
  const [deleteLoanId, setDeleteLoanId] = useState(null); // For delete modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For edit modal
  const [selectedLoan, setSelectedLoan] = useState(null); // For editing
  const [editFormData, setEditFormData] = useState({
    loanName: "",
    interestRate: "",
    eligibilityCriteria: "",
  });

  const [searchFilters, setSearchFilters] = useState({
    loanName: "",
    interestRate: "",
  });

  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1); 

  const fieldsToDisplay = [
    { key: "id", label: "ID" },
    { key: "loanName", label: "Loan Name" },
    { key: "interestRate", label: "Interest Rate" },
  ];
  const fieldsToDisplayForCSV = ["id" , "loanName" , "interestRate" , "minAmount" , "maxAmount" , "requiredDocuments" , "minRepayTenure" , "maxRepayTenure" , "minAge" , "minSalary"]

  const fetchLoanTypes = async (filters = {}) => {
    try {
      const fetchedLoanTypes = await getAllLoanTypes(filters, limit, page);
      setLoanTypes(fetchedLoanTypes);
    } catch (error) {
      console.error("Failed to fetch loan types:", error);
      toast.error("Failed to fetch loan types.");
    }
  };

  useEffect(() => {
    fetchLoanTypes();
  }, [limit , page]);

  const handleFilterChange = (key, value) => {
    setSearchFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const filters = {
        loanName: searchFilters.loanName,
        interestRate: searchFilters.interestRate,
      };

      const validFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => value)
      );

      await fetchLoanTypes(validFilters);
    } catch (error) {
      console.error("Failed to apply filters:", error.message || error);
      toast.error("Failed to apply filters.");
    }
  };

  const handleDetails = (loan) => {
    setSelectedLoanType(loan);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteLoanId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteLoanId) return;
    try {
      await deleteLoanType(deleteLoanId);
      setLoanTypes((prev) => prev.filter((loan) => loan.id !== deleteLoanId));
      setIsDeleteModalOpen(false);
      toast.success("Loan type deleted successfully!");
    } catch (error) {
      console.error("Failed to delete loan type:", error);
      toast.error("Failed to delete loan type.");
    }
  };

  const handleEditClick = (loan) => {
    setSelectedLoan(loan);
    setEditFormData({
      loanName: loan.loanName,
      interestRate: loan.interestRate,
      eligibilityCriteria: loan.eligibilityCriteria,
      minAmount: loan.minAmount,
      maxAmount: loan.maxAmount,
      minRepayTenure: loan.minRepayTenure,
      maxRepayTenure: loan.maxRepayTenure,
      requiredDocuments: loan.requiredDocuments,
      minAge: loan.minAge,
      minSalary: loan.minSalary,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedLoan(null);
    setEditFormData({
      loanName: "",
      interestRate: "",
      eligibilityCriteria: "",
      minAmount: "",
      maxAmount: "",
      minRepayTenure: "",
      maxRepayTenure: "",
      requiredDocuments: "",
      minAge: "",
      minSalary: "",
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLoan) return;

    try {
      let res = await updateLoanType(selectedLoan.id, editFormData);
      if(!res){
        toast.error("Failed to update loan type.");
      }
      fetchLoanTypes();
      toast.success("Loan type updated successfully!");
      closeEditModal();
    } catch (error) {
      console.error("Failed to update loan type:", error);
      toast.error("Failed to update loan type.");
    }
  };


  const handleDownloadCSV = async () => {
    try {
      const fileSize = 50000; 
  
      const fetchedLoanTypes = await getAllLoanTypes();
  
      if (!fetchedLoanTypes || fetchedLoanTypes.length === 0) {
        toast.error("No loanType available for download.");
        return;
      }
  
      const files = [];
      for (let i = 0; i < fetchedLoanTypes.length; i += fileSize) {
        files.push(fetchedLoanTypes.slice(i, i + fileSize));
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
          className="px-6 py-3 text-left min-w-[150px] border-l border-gray-200 last:border-r uppercase"
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

  const tableData = loanTypes.map((loan, index) => (
    <tr
      key={loan.id || index}
      className="hover:bg-gray-100 border-b last:border-b-0"
    >
      {fieldsToDisplay.map((keyName, cellIndex) => (
        <td
          key={cellIndex}
          className="px-6 py-4 border-l border-gray-200 text-gray-700 min-w-[150px] last:border-r"
        >
          {keyName.key === "id" ? index + 1 + (page - 1) * limit : loan[keyName.key]}
        </td>
      ))}
      <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
        <FaInfoCircle
          className="text-blue-600 cursor-pointer hover:text-blue-800"
          onClick={() => handleDetails(loan)}
          title="View Details"
        />
      </td>
      <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
        <FaEdit
          className="text-green-600 cursor-pointer hover:text-green-800"
          onClick={() => handleEditClick(loan)}
          title="Edit"
        />
      </td>
      <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
        <FaTrash
          className="text-red-600 cursor-pointer hover:text-red-800"
          onClick={() => handleDeleteClick(loan.id)}
          title="Delete"
        />
      </td>
    </tr>
  ));

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Loan Types</h2>
        <ItemsPerPageSelector setLimit={setLimit} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <SearchBar
          label="Loan Name"
          value={searchFilters.loanName}
          onChange={(value) => handleFilterChange("loanName", value)}
          placeholder="Search by Loan Name"
        />
        <SearchBar
          label="Interest Rate"
          value={searchFilters.interestRate}
          onChange={(value) => handleFilterChange("interestRate", value)}
          placeholder="Search by Interest Rate"
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
          onClick={handleSubmit}
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
                  No loan types found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} setPage={setPage}/>
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && selectedLoanType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-blue-700">
              Loan Type Details
            </h3>
            <p>
              <strong>Loan Name:</strong> {selectedLoanType.loanName}
            </p>
            <p>
              <strong>Interest Rate:</strong> {selectedLoanType.interestRate}%
            </p>
            <p>
              <strong>Eligibility Criteria:</strong>{" "}
              {selectedLoanType.eligibilityCriteria}
            </p>
            <p>
              <strong>Min Amount:</strong> ₹{selectedLoanType.minAmount}
            </p>
            <p>
              <strong>Max Amount:</strong> ₹{selectedLoanType.maxAmount}
            </p>
            <p>
              <strong>Min Repayment Tenure:</strong>{" "}
              {selectedLoanType.minRepayTenure} months
            </p>
            <p>
              <strong>Max Repayment Tenure:</strong>{" "}
              {selectedLoanType.maxRepayTenure} months
            </p>
            <p>
              <strong>Required Documents:</strong>{" "}
              {selectedLoanType.requiredDocuments}
            </p>
            <p>
              <strong>Minimum Age:</strong> {selectedLoanType.minAge} years
            </p>
            {selectedLoanType.minSalary > 0 && (
              <p>
                <strong>Minimum Salary:</strong> ₹{selectedLoanType.minSalary}
              </p>
            )}
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

      {/* Delete Confirmation Modal */}
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
            <h2 className="text-lg font-semibold text-green-600 mb-4 text-center">
              Edit Loan Type
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Loan Name and Interest Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="loanName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Loan Name
                  </label>
                  <input
                    id="loanName"
                    name="loanName"
                    type="text"
                    value={editFormData.loanName}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="interestRate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Interest Rate
                  </label>
                  <input
                    id="interestRate"
                    name="interestRate"
                    type="text"
                    value={editFormData.interestRate}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <label
                  htmlFor="eligibilityCriteria"
                  className="block text-sm font-medium text-gray-700"
                >
                  Eligibility Criteria
                </label>
                <textarea
                  id="eligibilityCriteria"
                  name="eligibilityCriteria"
                  value={editFormData.eligibilityCriteria}
                  onChange={handleEditFormChange}
                  required
                  rows="2"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Minimum and Maximum Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="minAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Amount
                  </label>
                  <input
                    id="minAmount"
                    name="minAmount"
                    type="number"
                    value={editFormData.minAmount}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Maximum Amount
                  </label>
                  <input
                    id="maxAmount"
                    name="maxAmount"
                    type="number"
                    value={editFormData.maxAmount}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Minimum and Maximum Repayment Tenure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="minRepayTenure"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Repayment Tenure (months)
                  </label>
                  <input
                    id="minRepayTenure"
                    name="minRepayTenure"
                    type="number"
                    value={editFormData.minRepayTenure}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxRepayTenure"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Maximum Repayment Tenure (months)
                  </label>
                  <input
                    id="maxRepayTenure"
                    name="maxRepayTenure"
                    type="number"
                    value={editFormData.maxRepayTenure}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <label
                  htmlFor="requiredDocuments"
                  className="block text-sm font-medium text-gray-700"
                >
                  Required Documents
                </label>
                <textarea
                  id="requiredDocuments"
                  name="requiredDocuments"
                  value={editFormData.requiredDocuments}
                  onChange={handleEditFormChange}
                  required
                  rows="2"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Minimum Age and Minimum Salary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="minAge"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Age
                  </label>
                  <input
                    id="minAge"
                    name="minAge"
                    type="number"
                    value={editFormData.minAge}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="minSalary"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Salary
                  </label>
                  <input
                    id="minSalary"
                    name="minSalary"
                    type="number"
                    value={editFormData.minSalary}
                    onChange={handleEditFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700"
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

export default LoanTypes;
