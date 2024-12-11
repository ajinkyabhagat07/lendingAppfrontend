"use client";

import ItemsPerPageSelector from "@/components/ItemPerPageSelector";
import Pagination from "@/components/Pagination";
import { getAllEmis, getAllEmisofUser } from "@/lib/emis";
import { verifyToken } from "@/lib/users";
import formatDate from "@/utils/formatdate";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

const ActiveLoans = () => {
  const [loanDetails, setLoanDetails] = useState([]);
  const [emis, setEmis] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [emiPage , setEmiPage] = useState(1);
  const [emiLimit , setEmiLimit] = useState(10)


  const fetchEmis = async () => {
    try {
      const tokenData = await verifyToken();;
      const id = tokenData.id; 
      const filterParams = {loanStatus : "approved"} 
      const response = await getAllEmisofUser(id , filterParams , limit , page);
      //console.log(response);
      setLoanDetails(response);
    } catch (error) {
      console.error("Error fetching EMIs:", error);
    }
  };

  useEffect(() => {
    fetchEmis();
  }, [limit , page]);

  const fieldsToDisplay = [
    { key: "index", label: "ID" },
    { key: "accountNumber", label: "Account Number" },
    { key: "loanAmount", label: "Loan Amount" },
    { key: "durationMonths", label: "Duration (Months)" },
    { key: "emiAmount", label: "EMI Amount" },
  ];

  const emiFieldsToDisplay = [
    { key: "id", label: "EMI ID" },
    { key: "accountNumber", label: "Account Number" },
    { key: "amount", label: "Amount" },
    { key: "dueDate", label: "Due Date" },
    { key: "paymentDate", label: "Payment Date" },
    { key: "status", label: "Status" },
  ];

  const handleEmiClick = (loan) => {
    const sortedEmis = [...loan.emis].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    setSelectedLoan(loan);
    setEmis(sortedEmis);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Loan Details</h2>
        <ItemsPerPageSelector setLimit={setLimit} />
      </div>

      {/* Loan Details Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-blue-600 text-white text-sm uppercase tracking-wider">
            {fieldsToDisplay.map((field) => (
              <th
                key={field.key}
                className="px-6 py-3 text-left min-w-[150px] border-l border-gray-200 last:border-r uppercase"
              >
                {field.label}
              </th>
            ))}
            <th className="px-6 py-3 text-center min-w-[100px] border-l border-gray-200 uppercase">
              EMI Details
            </th>
          </tr>
        </thead>
        <tbody>
          {loanDetails.length > 0 ? (
            loanDetails.map((loan, index) => (
              <tr key={loan.id} className="hover:bg-gray-100 border-b last:border-b-0">
                {fieldsToDisplay.map((field) => (
                  <td
                    key={field.key}
                    className="px-6 py-4 border-l border-gray-200 text-gray-700 min-w-[150px] last:border-r"
                  >
                    {field.key === "index"
                      ? index + 1
                      : field.key === "accountNumber"
                      ? loan.emis[0]?.accountNumber || "N/A"
                      : loan[field.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
                  <button
                    onClick={() => handleEmiClick(loan)}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View EMIs
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={fieldsToDisplay.length + 1} className="text-center py-4 text-gray-500">
                No loan details found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination page={page} setPage={setPage} />

      {/* EMI Details Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
      <h3 className="text-lg font-bold mb-4 text-blue-700">EMI Details</h3>
      <div className="h-[400px] overflow-y-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white text-sm uppercase tracking-wider">
              {emiFieldsToDisplay.map((field) => (
                <th
                  key={field.key}
                  className="px-4 py-2 text-left border-l border-gray-200 last:border-r"
                >
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {emis.slice((emiPage - 1) * emiLimit, emiPage * emiLimit).length > 0 ? (
              emis.slice((emiPage - 1) * emiLimit, emiPage * emiLimit) .map((emi, index) => (
                  <tr
                    key={emi.id || index}
                    className="hover:bg-gray-100 border-b last:border-b-0"
                  >
                    {emiFieldsToDisplay.map((field) => (
                      <td
                        key={field.key}
                        className="px-4 py-2 border-l border-gray-200 text-gray-700 last:border-r"
                      >
                        {field.key === "id"
                          ? index + 1 + (emiPage - 1) * emiLimit // index for current page
                          : field.key === "paymentDate"
                          ? emi[field.key] !== null
                            ? formatDate(emi[field.key])
                            : "N/A"
                          : field.key === "dueDate"
                          ? emi[field.key]
                            ? formatDate(emi[field.key])
                            : "N/A"
                          : emi[field.key]}
                      </td>
                    ))}
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan={emiFieldsToDisplay.length}
                  className="text-center py-4 text-gray-500"
                >
                  No EMI details found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <label htmlFor="emiLimit" className="mr-2">
            Items per page:
          </label>
          <select
            id="emiLimit"
            value={emiLimit}
            onChange={(e) => {
              setEmiLimit(Number(e.target.value));
              setEmiPage(1); // Reset to first page on limit change
            }}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            {[5, 10, 15].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            disabled={emiPage <= 1}
            onClick={() => setEmiPage(emiPage - 1)}
            className={`px-4 py-2 border rounded-md ${
              emiPage <= 1 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>
          <span className="mx-2">
            Page {emiPage}
          </span>
          <button
            disabled={emiPage * emiLimit >= emis.length}
            onClick={() => setEmiPage(emiPage + 1)}
            className={`px-4 py-2 border rounded-md ${
              emiPage * emiLimit >= emis.length
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setIsModalOpen(false)}
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

export default ActiveLoans;