"use client";

import {  getAllEmisofUser } from "@/lib/emis";
import { verifyToken } from "@/lib/users";
import formatDate from "@/utils/formatdate";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PayEmi = () => {
  const [loanDetails, setLoanDetails] = useState([]);
  const [emis, setEmis] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const fetchEmis = async () => {
    try {
      const tokenData = await verifyToken();;
      const id = tokenData.id; 
        const filterParams = {loanStatus : "approved"} 
        const response = await getAllEmisofUser(id , filterParams)
        setLoanDetails(response);
    } catch (error) {
      console.error("Error fetching EMIs:", error);
    }
  };

  useEffect(() => {
    fetchEmis();
  }, []);

  
  const handleEmiClick = (loan) => {
    const sortedEmis = [...loan.emis].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    setSelectedLoan(loan);
    setEmis(sortedEmis);
    setIsModalOpen(true);
  };

  const handlePayment = (emi) => {
    router.push(`/user/payment?emiId=${emi.id}`);
  };


  return (
    <div className="max-w-7xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Pay EMI</h2>
      <p className="text-gray-600 mb-8">
        Select a loan to view and pay your EMIs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loanDetails.length > 0 ? (
          loanDetails.map((loan, index) => (
            <div
              key={loan.id}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-blue-700">
                Loan Number: {loan.emis[0].accountNumber}
              </h3>
              <p className="text-gray-700">Loan Amount: {loan.loanAmount}</p>
              <p className="text-gray-700">EMI Amount: {loan.emiAmount}</p>
              <p className="text-gray-700">
                Duration: {loan.durationMonths} months
              </p>

              <button
                onClick={() => handleEmiClick(loan)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View EMIs
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No active loans found.
          </p>
        )}
      </div>

      {isModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
            <h3 className="text-lg font-bold mb-4 text-blue-700">
              EMIs for Loan Number: {emis[0].accountNumber}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-[400px] overflow-y-auto">
              {emis.length > 0 ? (
                emis.map((emi, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg shadow hover:shadow-md transition"
                  >
                    <h4 className="text-md font-bold text-blue-600">
                      EMI ID: {index + 1}
                    </h4>
                    <p className="text-gray-700">Amount: {emi.amount}</p>
                    <p className="text-gray-700">
                      Due Date: {formatDate(emi.dueDate)}
                    </p>
                    <p className="text-gray-700">
                      Payment Date:{" "}
                      {emi.paymentDate ? formatDate(emi.paymentDate) : "N/A"}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        emi.status === "Paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Status: {emi.status}
                    </p>
                    {(emi.status === "Pending" || emi.status === "Overdue") && (
                      <button
                        onClick={() => handlePayment(emi)}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">
                  No EMI details found.
                </p>
              )}
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

export default PayEmi;