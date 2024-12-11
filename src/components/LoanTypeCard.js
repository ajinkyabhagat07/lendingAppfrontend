"use client";

import { getprofileData, verifyToken } from "@/lib/users";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LoanTypeCard = ({ loanType }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [age, setAge] = useState();

  // Fetch token after component mounts
  useEffect(() => {
    const fetchData = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        const data = await verifyToken();
        const id = data.id;
        const userData = await getprofileData(id);
        setToken(savedToken);

        if (userData.dateOfBirth) {
          const userAge = calculateAge(userData.dateOfBirth);
          setAge(userAge);
        }
      }
    };
    fetchData();
  }, []);

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };
  const handleApply = (loanType) => {
    if (!token) {
      router.push("/signup");
      return;
    } else {
      const sanitizedLoanName = loanType.loanName.replace(/\s+/g, "-");
      router.push(`/user/${sanitizedLoanName}/apply`);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <h2 className="text-2xl font-bold text-blue-700 mb-3">
        {loanType.loanName}
      </h2>
      <p className="text-gray-600 mb-4">
        <strong className="text-gray-700">Eligibility Criteria:</strong>{" "}
        {loanType.eligibilityCriteria}
      </p>
      <div className="text-gray-700 space-y-2">
        <p>
          <strong className="text-gray-800">Interest Rate:</strong>{" "}
          {loanType.interestRate}%
        </p>
        <p>
          <strong className="text-gray-800">Min Loan Amount:</strong> ₹
          {parseFloat(loanType.minAmount).toLocaleString()}
        </p>
        <p>
          <strong className="text-gray-800">Max Loan Amount:</strong> ₹
          {parseFloat(loanType.maxAmount).toLocaleString()}
        </p>
        <p>
          <strong className="text-gray-800">Min Repayment Tenure:</strong>{" "}
          {loanType.minRepayTenure} months
        </p>
        <p>
          <strong className="text-gray-800">Max Repayment Tenure:</strong>{" "}
          {loanType.maxRepayTenure} months
        </p>
        <p>
          <strong className="text-gray-800">Required Documents:</strong>{" "}
          {loanType.requiredDocuments}
        </p>
      </div>
      <div>
        {token ? (
          age > loanType.minAge ? (
            <button
              onClick={() => handleApply(loanType)}
              className="mt-6 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Apply Now
            </button>
          ) : (
            <button
              className="mt-6 px-6 py-2 text-white bg-gray-500 rounded-lg cursor-not-allowed"
              disabled
            >
              Not Eligible
            </button>
          )
        ) : (
          <button
            onClick={() => handleApply(loanType)}
            className="mt-6 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default LoanTypeCard;
