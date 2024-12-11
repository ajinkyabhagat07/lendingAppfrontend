"use client";

import ItemsPerPageSelector from "@/components/ItemPerPageSelector";
import Pagination from "@/components/Pagination";
import { approveLoan, getAppliedLoans, getAppliedLoansStatus, rejectLoan } from "@/lib/Loans";
import { getAllLoanTypes } from "@/lib/loanTypes";
import { generateAndDownloadCSV } from "@/utils/generateAndDownloadCSV";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaDownload, FaInfoCircle } from "react-icons/fa";

const LoanRequest = () => {
  const [appliedLoans, setAppliedLoans] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null); // For details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState({}); 
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1); 

  const fieldsToDisplay = [
    { key: "id", label: "ID" },
    { key: "loanName", label: "Loan Name" },
    { key: "loanAmount", label: "Loan Amount" },
    { key: "loanStatus", label: "Loan Status" },
  ];
  const fieldsToDisplayForCSV = ["id" , "loanTypeId" , "customerId" , "aadhar" , "pan" , "additionalDocument" , "loanAmount" , "address" , "durationMonths" , "emiAmount"];

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
      const filterParams = {loanStatus : "Pending"}
      const loans = await getAppliedLoansStatus(filterParams , limit, page);
      //console.log(loans);
  
      const enrichedLoans = loans
        .map((loan) => {
          const loanType = loanTypes.find((type) => type.id === loan.loanTypeId);
          return {
            ...loan,
            loanName: loanType ? loanType.loanName : "Unknown Loan Type",
          };
        })
  
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
  }, [loanTypes , limit, page]);

  const handleDetailsClick = (loan) => {
    setSelectedLoan(loan);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = async (loanId) => {
    try {
      const approvedDate = new Date().toISOString();
      await approveLoan(loanId ,{loanStatus : "approved", approvedDate : approvedDate});
      toast.success("Loan approved successfully!");
      fetchAppliedLoans();
    } catch (error) {
      console.error("Failed to approve loan:", error);
      toast.error("Failed to approve loan.");
    }
  };

  const handleReject = async (loanId) => {
    const reason = rejectionReasons[loanId];
    if (!reason) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    try {
      await rejectLoan(loanId, {loanStatus : "rejected" , reasonForRejection : reason});
      toast.success("Loan rejected successfully!");
      setRejectionReasons((prev) => ({ ...prev, [loanId]: "" }));
      fetchAppliedLoans();
    } catch (error) {
      console.error("Failed to reject loan:", error);
      toast.error("Failed to reject loan.");
    }
  };

  const handleRejectionReasonChange = (loanId, value) => {
    setRejectionReasons((prev) => ({ ...prev, [loanId]: value }));
  };

  const handleDownloadCSV = async () => {
    try {
      const fileSize = 50000; 
      const filterParams = {loanStatus : "Pending"}
      const loans = await getAppliedLoansStatus(filterParams);
  
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
          className="px-6 py-3 text-left min-w-[150px] border-l border-gray-200 last:border-r uppercase"
        >
          {field.label}
        </th>
      ))}
      <th className="px-6 py-3 text-center min-w-[100px] border-l border-gray-200 uppercase">
        Details
      </th>
      <th className="px-6 py-3 text-center min-w-[200px] border-l border-gray-200 uppercase">
        Actions
      </th>
    </>
  );

  const tableData = appliedLoans.map((loan, index) => (
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
          onClick={() => handleDetailsClick(loan)}
          title="View Details"
        />
      </td>
      <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={() => handleApprove(loan.id)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Approve
          </button>
          <input
            type="text"
            placeholder="Reason for rejection"
            value={rejectionReasons[loan.id] || ""} 
            onChange={(e) => handleRejectionReasonChange(loan.id, e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
          />
        
          <button
            onClick={() => handleReject(loan.id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Loan Requests</h2>
        <ItemsPerPageSelector setLimit={setLimit} />
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleDownloadCSV}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none ml-auto"
        >
          <FaDownload className="mr-2" />
          Download CSV
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
                  No loan requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} setPage={setPage}/>
      </div>

      {/* Details Modal */}
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

export default LoanRequest;