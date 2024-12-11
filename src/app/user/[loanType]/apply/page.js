"use client";

import React, { useEffect, useState } from "react";
import { getAllLoanTypes } from "@/lib/loanTypes";
import photoUrlService from "@/utils/photoUrlService";
import { jwtDecode } from "jwt-decode";
import { LoanEntry } from "@/lib/Loans";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { verifyToken } from "@/lib/users";

const ApplyPage = ({ params }) => {
    const [loanType, setLoanType] = useState("");
    const pathname = usePathname();
    const sanitizedLoanName = loanType.replace(/-/g, " ");

  const [reqLoanType, setReqLoanType] = useState(null);
  const [formData, setFormData] = useState({
    aadhar: null,
    pan: null,
    additionalDocument: null,
    loanAmount: "",
    address: "",
    durationMonths: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calculatedEMI, setCalculatedEMI] = useState(null);
  const [totalRepayment, setTotalRepayment] = useState(null);

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      const loanTypeValue = resolvedParams.loanType.replace(/-/g, " ");
      setLoanType(loanTypeValue);
      const filters = { loanName: sanitizedLoanName };
      const fetchedLoanTypes = await getAllLoanTypes(filters);
      setReqLoanType(fetchedLoanTypes[0]); 
    })();
  });


  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [fieldName]: file }));
  };

  const calculateEMI = (loanAmount, interestRate, durationMonths) => {
    const monthlyRate = interestRate / 100 / 12;
    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
      (Math.pow(1 + monthlyRate, durationMonths) - 1);
    return emi.toFixed(2);
  };

  const handleApply = () => {
    if (!formData.loanAmount || !formData.durationMonths) {
      toast.error("Please enter loan amount and duration.");
      return;
    }
    const emi = calculateEMI(
      parseFloat(formData.loanAmount),
      reqLoanType.interestRate,
      parseInt(formData.durationMonths, 10)
    );
    const totalRepayment = (emi * parseInt(formData.durationMonths, 10)).toFixed(2);
    setCalculatedEMI(emi);
    setTotalRepayment(totalRepayment);
    setIsModalOpen(true);
  };

 

  const handleSubmit = async () => {
    try {
      const uploadedAadhar = await photoUrlService(formData.aadhar);
      const uploadedPan = await photoUrlService(formData.pan);
      const uploadedadditionalDocument = await photoUrlService(formData.additionalDocument);

      const tokenData = await verifyToken();
      const userId = tokenData.id;
          
      const data = {
        loanTypeId: reqLoanType.id,
        customerId: userId, 
        aadhar: uploadedAadhar,
        pan: uploadedPan,
        additionalDocument: uploadedadditionalDocument,
        loanAmount: parseFloat(formData.loanAmount),
        address: formData.address,
        durationMonths: parseInt(formData.durationMonths, 10),
        emiAmount: parseFloat(calculatedEMI),
        loanStatus: "Pending",
        reasonForRejection: null,
        appliedDate: new Date().toISOString().split("T")[0],
        approvedDate: null
      };

      uploadedadditionalDocument ? await LoanEntry(data) : null;
      toast.success("Loan application submitted successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);  
      toast.error("An error occurred while submitting your loan application.");
    }
  };

//   useEffect(() => {
//     fetchLoanType();
//   }, [loanType]);

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      {reqLoanType ? (
        <div>
          <h1 className="text-2xl font-bold text-blue-700 mb-4">
            Apply for {reqLoanType.loanName}
          </h1>
          <form className="space-y-4">
            {/* Aadhar and PAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700">
                  Aadhar Document
                </label>
                <input
                  id="aadhar"
                  name="aadhar"
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => handleFileChange(e, "aadhar")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                  PAN Document
                </label>
                <input
                  id="pan"
                  name="pan"
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => handleFileChange(e, "pan")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Salary Slip */}
            <div>
              <label htmlFor="salarySlip" className="block text-sm font-medium text-gray-700">
              Additional Document
              </label>
              <input
                id="additionalDocument"
                name="additionalDocument"
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFileChange(e, "additionalDocument")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            {/* Loan Amount and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700">
                  Loan Amount
                </label>
                <input
                  id="loanAmount"
                  name="loanAmount"
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                  min={reqLoanType.minAmount}
                  max={reqLoanType.maxAmount}
                  placeholder={`₹${reqLoanType.minAmount} - ₹${reqLoanType.maxAmount}`}
                />
              </div>
              <div>
                <label
                  htmlFor="durationMonths"
                  className="block text-sm font-medium text-gray-700"
                >
                  Loan Duration (Months)
                </label>
                <input
                  id="durationMonths"
                  name="durationMonths"
                  type="number"
                  value={formData.durationMonths}
                  onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                  min={reqLoanType.minRepayTenure}
                  max={reqLoanType.maxRepayTenure}
                  placeholder={`${reqLoanType.minRepayTenure} - ${reqLoanType.maxRepayTenure} months`}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={handleApply}
              className="mt-4 px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Apply
            </button>
          </form>
        </div>
      ) : (
        <p>Loading loan type information...</p>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold text-blue-600 mb-4">Loan Application Summary</h2>
            <p><strong>Loan Name:</strong> {reqLoanType.loanName}</p>
            <p><strong>Loan Amount:</strong> ₹{formData.loanAmount}</p>
            <p><strong>Duration:</strong> {formData.durationMonths} months</p>
            <p><strong>EMI Amount:</strong> ₹{calculatedEMI}</p>
            <p><strong>Total Repayment:</strong> ₹{totalRepayment}</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyPage;