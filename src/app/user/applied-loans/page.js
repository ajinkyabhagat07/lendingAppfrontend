"use client";

import ItemsPerPageSelector from "@/components/ItemPerPageSelector";
import Pagination from "@/components/Pagination";
import { getAllAppliedLoansOfUser, getAppliedLoans } from "@/lib/Loans";
import { getAllLoanTypes } from "@/lib/loanTypes";
import { verifyToken } from "@/lib/users";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

const AppliedLoans = () => {
  const [appliedLoans, setAppliedLoans] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null); // For details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  

  const fieldsToDisplay = [
    "id",
    "loanName",
    "loanAmount",
    "durationMonths",
    "loanStatus",
  ];

  // Fetch loan types to resolve names
  const fetchLoanTypes = async () => {
    try {
      const types = await getAllLoanTypes();
      setLoanTypes(types);
    } catch (error) {
      console.error("Failed to fetch loan types:", error);
      alert("Failed to fetch loan types.");
    }
  };

  // Fetch applied loans
  const fetchAppliedLoans = async () => {
    try {
      const tokenData = await verifyToken();;
      const id = tokenData.id;  
      const loans = await getAllAppliedLoansOfUser(id , limit , page);
      

      // Enrich loans with loanTypeName by resolving `loanTypeId`
      const enrichedLoans = loans.map((loan) => {
        const loanType = loanTypes.find((type) => type.id === loan.loanTypeId);
        return {
          ...loan,
          loanName: loanType ? loanType.loanName : "Unknown Loan Type",
        };
      });

      setAppliedLoans(enrichedLoans);
    } catch (error) {
      console.error("Failed to fetch applied loans:", error);
      alert("Failed to fetch applied loans.");
    }
  };

  useEffect(() => {
    fetchLoanTypes();
  }, []);

  useEffect(() => {
    if (loanTypes.length > 0) {
      fetchAppliedLoans();
    }
  }, [loanTypes , limit , page]);

  const handleDetailsClick = (loan) => {
    setSelectedLoan(loan);
    setIsDetailsModalOpen(true);
  };

  const header = (
    <>
      {fieldsToDisplay.map((field, index) => (
        <th
          key={index}
          className="px-6 py-3 text-left min-w-[150px] border-l border-gray-200 last:border-r uppercase"
        >
          {field}
        </th>
      ))}
      <th className="px-6 py-3 text-center min-w-[100px] border-l border-gray-200 uppercase">
        Details
      </th>
    </>
  );

  const tableData = appliedLoans.map((loan, index) => (
    <tr
      key={loan.id || index}
      className="hover:bg-gray-100 border-b last:border-b-0"
    >
      {fieldsToDisplay.map((key, cellIndex) => (
        <td
          key={cellIndex}
          className="px-6 py-4 border-l border-gray-200 text-gray-700 min-w-[150px] last:border-r"
        >
          {key === "id" ? index + 1 + (page - 1) * limit : loan[key]}
        </td>
      ))}
      <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
        <FaInfoCircle
          className="text-blue-600 cursor-pointer hover:text-blue-800"
          onClick={() => handleDetailsClick(loan)}
          title="View Details"
        />
      </td>
    </tr>
  ));

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Applied Loans</h2>
        <ItemsPerPageSelector setLimit={setLimit} />
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
                  colSpan={fieldsToDisplay.length + 1}
                  className="text-center py-4 text-gray-500"
                >
                  No applied loans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} setPage={setPage} />
      </div>

     
      {isDetailsModalOpen && selectedLoan && (
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
            {selectedLoan.loanStatus && (
              <p>
                <strong>Status:</strong> {selectedLoan.loanStatus}
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
            {selectedLoan.address && (
              <p>
                <strong>Address:</strong> {selectedLoan.address}
              </p>
            )}
            {selectedLoan.appliedDate && (
              <p>
                <strong>Applied Date:</strong>{" "}
                {new Date(selectedLoan.appliedDate).toLocaleDateString()}
              </p>
            )}
            {selectedLoan.approvedDate && (
              <p>
                <strong>Approved Date:</strong>{" "}
                {new Date(selectedLoan.approvedDate).toLocaleDateString()}
              </p>
            )}
            {selectedLoan.reasonForRejection && (
              <p>
                <strong>Reason for Rejection:</strong>{" "}
                {selectedLoan.reasonForRejection}
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
    </div>
  );
};

export default AppliedLoans;
