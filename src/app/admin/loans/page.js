"use client";

import ItemsPerPageSelector from "@/components/ItemPerPageSelector";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { getAppliedLoans } from "@/lib/Loans";
import { getAllLoanTypes } from "@/lib/loanTypes";
import { getAllusers } from "@/lib/users";
import { generateAndDownloadCSV } from "@/utils/generateAndDownloadCSV";
import React, { useEffect, useState } from "react";
import { FaDownload, FaInfoCircle } from "react-icons/fa";

const Loans = () => {
  const [activeLoans, setActiveLoans] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isLoanDetailsModalOpen, setIsLoanDetailsModalOpen] = useState(false);
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    accountNumber: "",
  });

  const fieldsToDisplay = [
    { key: "id", label: "ID" },
    { key: "accountNumber", label: "Account Number" },
    { key: "loanName", label: "Loan Name" },
    { key: "loanAmount", label: "Loan Amount" },
  ];
  const fieldsToDisplayForCSV = ["id" , "loanTypeId" , "customerId" , "aadhar" , "pan" , "additionalDocument" , "loanAmount" , "address" , "durationMonths" , "emiAmount"];

  const fetchLoanTypes = async () => {
    try {
      const types = await getAllLoanTypes();
      setLoanTypes(types);
    } catch (error) {
      console.error("Failed to fetch loan types:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await getAllusers();
      console.log(users);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchAppliedLoans = async () => {
    try {
      const filterParams = { loanStatus: "approved" };
      const loans = await getAppliedLoans(filterParams, limit, page);
      //console.log(loans);

      const enrichedLoans = loans.map((loan) => {
        const loanType = loanTypes.find((type) => type.id === loan.loanTypeId);
        const user = users.find((user) => user.id === loan.customerId);
        return {
          ...loan,
          loanName: loanType ? loanType.loanName : "Unknown Loan Type",
          firstname: user ? user.firstName : "Unknown",
          lastname: user ? user.lastName : "Unknown",
          email: user ? user.email : "Unknown",
          phone: user ? user.phoneNumber : "Unknown",
        };
      });
      console.log(enrichedLoans);

      setActiveLoans(enrichedLoans);
    } catch (error) {
      console.error("Failed to fetch applied loans:", error);
    }
  };

  useEffect(() => {
    fetchLoanTypes();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (loanTypes.length > 0 && users.length > 0) {
      fetchAppliedLoans();
    }
  }, [loanTypes, users, limit, page]);

  const handleLoanDetailsClick = (loan) => {
    setSelectedLoan(loan);
    setIsLoanDetailsModalOpen(true);
  };

  const handleUserDetailsClick = (loan) => {
    setSelectedLoan(loan);
    setIsUserDetailsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      //console.log(searchFilters);
      const enrichedLoans = activeLoans.filter((loan) => loan.emis[0].accountNumber === searchFilters.accountNumber);

      setActiveLoans(enrichedLoans);
    } catch (error) {
      console.error("Failed to apply filters:", error.message || error);
      toast.error("Failed to apply filters.");
    }
  };

  const handleFilterChange = (key, value) => {
    setSearchFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownloadCSV = async () => {
    try {
      const fileSize = 50000; 
      const filterParams = { loanStatus: "approved" };
      const loans = await getAppliedLoans(filterParams);
  
      if (!loans || loans.length === 0) {
        toast.error("No loanType available for download.");
        return;
      }
  
      const files = [];
      for (let i = 0; i < loans.length; i += fileSize) {
        files.push(loans.slice(i, i + fileSize));
      }
  
      await Promise.all(
        files.map((file, index) => generateAndDownloadCSV(file, index + 1 , fieldsToDisplayForCSV))
      );
  
      toast.success("CSV files downloaded successfully!");
    } catch (error) {

      console.log("Failed to download CSV files.");
    }
  };

  const header = (
    <>
      {fieldsToDisplay.map((field, index) => (
        <th
          key={index}
          className={`px-6 py-3 text-left ${
            field.key === "id" ? "min-w-[70px] max-w-[70px]" : "min-w-[150px]"
          } border-l border-gray-200 last:border-r uppercase`}
        >
          {field.label}
        </th>
      ))}
      <th className="px-6 py-3 text-center min-w-[100px] border-l border-gray-200 uppercase">
        Loan Details
      </th>
      <th className="px-6 py-3 text-center min-w-[100px] border-l border-gray-200 uppercase">
        User Details
      </th>
    </>
  );

  const tableData = activeLoans.map((loan, index) => (
    <tr
      key={loan.id || index}
      className="hover:bg-gray-100 border-b last:border-b-0"
    >
      {fieldsToDisplay.map((keyName, cellIndex) => (
        <td
          key={cellIndex}
          className={`px-6 py-4 border-l border-gray-200 text-gray-700 ${
            keyName.key === "id"
              ? "min-w-[70px] max-w-[70px] truncate"
              : "min-w-[150px]"
          } last:border-r`}
        >
          {keyName.key === "id"
            ? index + 1 + (page - 1) * limit
            : keyName.key === "accountNumber"
            ? loan.emis[0].accountNumber
            : loan[keyName.key]}
        </td>
      ))}
      <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
        <FaInfoCircle
          className="text-blue-600 cursor-pointer hover:text-blue-800"
          onClick={() => handleLoanDetailsClick(loan)}
          title="View Loan Details"
        />
      </td>
      <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
        <FaInfoCircle
          className="text-green-600 cursor-pointer hover:text-green-800"
          onClick={() => handleUserDetailsClick(loan)}
          title="View User Details"
        />
      </td>
    </tr>
  ));

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Active Loans</h2>
        <ItemsPerPageSelector setLimit={setLimit} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <SearchBar
          label="Loan Number"
          value={searchFilters.accountNumber}
          onChange={(value) => handleFilterChange("accountNumber", value)}
          placeholder="Search by Loan Number"
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
                  colSpan={fieldsToDisplay.length + 2}
                  className="text-center py-4 text-gray-500"
                >
                  No active loans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} setPage={setPage} />
      </div>
      {/* Loan Details Modal */}
      {isLoanDetailsModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-blue-700">
              Loan Details
            </h3>
            {selectedLoan.loanName && (
              <p>
                <strong>Loan Name:</strong> {selectedLoan.loanName}
              </p>
            )}
            {selectedLoan.loanAmount && (
              <p>
                <strong>Loan Amount:</strong> ₹{selectedLoan.loanAmount}
              </p>
            )}
            {selectedLoan.durationMonths && (
              <p>
                <strong>Duration:</strong> {selectedLoan.durationMonths} months
              </p>
            )}
            {selectedLoan.emiAmount && (
              <p>
                <strong>EMI Amount:</strong> ₹{selectedLoan.emiAmount}
              </p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsLoanDetailsModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* User Details Modal */}
      {isUserDetailsModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-green-700">
              User Details
            </h3>
            {selectedLoan.firstname && (
              <p>
                <strong>First Name:</strong> {selectedLoan.firstname}
              </p>
            )}
            {selectedLoan.lastname && (
              <p>
                <strong>Last Name:</strong> {selectedLoan.lastname}
              </p>
            )}
            {selectedLoan.email && (
              <p>
                <strong>Email:</strong> {selectedLoan.email}
              </p>
            )}
            {selectedLoan.phone && (
              <p>
                <strong>Phone:</strong> {selectedLoan.phone}
              </p>
            )}
            {selectedLoan.address && (
              <p>
                <strong>Address:</strong> {selectedLoan.address}
              </p>
            )}
            {selectedLoan.aadhar && (
              <p>
                <strong>Aadhar:</strong>{" "}
                <a
                  href={selectedLoan.aadhar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Document
                </a>
              </p>
            )}
            {selectedLoan.pan && (
              <p>
                <strong>PAN:</strong>{" "}
                <a
                  href={selectedLoan.pan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Document
                </a>
              </p>
            )}
            {selectedLoan.additionalDocument && (
              <p>
                <strong>Additional Document:</strong>{" "}
                <a
                  href={selectedLoan.additionalDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Document
                </a>
              </p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsUserDetailsModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
