'use client'
import LoanTypeCard from "@/components/LoanTypeCard";
import { getAllLoanTypes } from "@/lib/loanTypes";
import React, { useEffect, useState} from "react";



export default function UserDashBoard() {
  const [loanTypes, setLoanTypes] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const fetchLoanTypes = async () => {
    try {
      const fetchedLoanTypes = await getAllLoanTypes({}, limit, page);
      setLoanTypes(fetchedLoanTypes);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLoanTypes();
  }, [limit, page]);

  return (
    <div className="min-h-screen bg-gray-50 -mt-12 pt-12 px-6">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-blue-700">Explore Our Loan Options</h1>
      <p className="text-gray-600 mt-2">
        Choose the right loan that fits your needs. We offer the best rates and flexible terms.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loanTypes.map((loanType) => (
        <LoanTypeCard key={loanType.id} loanType={loanType} />
      ))}
    </div>
  </div>
  );
}