'use client';

import { createLoanType } from '@/lib/loanTypes';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const CreateLoanType = () => {
  const [formData, setFormData] = useState({
    loanName: '',
    eligibilityCriteria: '',
    interestRate: '',
    minAmount: '',
    maxAmount: '',
    minRepayTenure: '',
    maxRepayTenure: '',
    requiredDocuments: '',
    minAge: '',
    minSalary: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await createLoanType(formData);
      if (res) {
        toast.success('Loan type created successfully!');
        setFormData({
          loanName: '',
          eligibilityCriteria: '',
          interestRate: '',
          minAmount: '',
          maxAmount: '',
          minRepayTenure: '',
          maxRepayTenure: '',
          requiredDocuments: '',
          minAge: '',
          minSalary: '',
        });
      } else {
        toast.error('Error in creating loan type.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br  to-blue-50">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-blue-700 text-center">
          Create Loan Type
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Single Row: Loan Name and Interest Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="loanName" className="block text-lg font-medium text-gray-700">
                Loan Name
              </label>
              <input
                type="text"
                name="loanName"
                id="loanName"
                value={formData.loanName}
                onChange={(e) => setFormData({ ...formData, loanName: e.target.value })}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter loan name"
              />
            </div>

            <div>
              <label htmlFor="interestRate" className="block text-lg font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <input
                type="number"
                name="interestRate"
                id="interestRate"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter interest rate"
              />
            </div>
          </div>

          {/* Single Row: Minimum Amount and Maximum Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="minAmount" className="block text-lg font-medium text-gray-700">
                Minimum Amount
              </label>
              <input
                type="number"
                name="minAmount"
                id="minAmount"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter minimum loan amount"
              />
            </div>

            <div>
              <label htmlFor="maxAmount" className="block text-lg font-medium text-gray-700">
                Maximum Amount
              </label>
              <input
                type="number"
                name="maxAmount"
                id="maxAmount"
                value={formData.maxAmount}
                onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter maximum loan amount"
              />
            </div>
          </div>

          {/* Single Row: Minimum Repayment Tenure and Maximum Repayment Tenure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="minRepayTenure" className="block text-lg font-medium text-gray-700">
                Minimum Repayment Tenure (months)
              </label>
              <input
                type="number"
                name="minRepayTenure"
                id="minRepayTenure"
                value={formData.minRepayTenure}
                onChange={(e) => setFormData({ ...formData, minRepayTenure: e.target.value })}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter minimum repayment tenure"
              />
            </div>

            <div>
              <label htmlFor="maxRepayTenure" className="block text-lg font-medium text-gray-700">
                Maximum Repayment Tenure (months)
              </label>
              <input
                type="number"
                name="maxRepayTenure"
                id="maxRepayTenure"
                value={formData.maxRepayTenure}
                onChange={(e) => setFormData({ ...formData, maxRepayTenure: e.target.value })}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter maximum repayment tenure"
              />
            </div>
          </div>

          {/* Single Row: Minimum Age and Minimum Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="minAge" className="block text-lg font-medium text-gray-700">
                Minimum Age
              </label>
              <input
                type="number"
                name="minAge"
                id="minAge"
                value={formData.minAge}
                onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter minimum age"
              />
            </div>

            <div>
              <label htmlFor="minSalary" className="block text-lg font-medium text-gray-700">
                Minimum Salary
              </label>
              <input
                type="number"
                name="minSalary"
                id="minSalary"
                value={formData.minSalary}
                onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter minimum salary"
              />
            </div>
          </div>

          {/* Single Row: Eligibility Criteria */}
          <div>
            <label htmlFor="eligibilityCriteria" className="block text-lg font-medium text-gray-700">
              Eligibility Criteria
            </label>
            <textarea
              name="eligibilityCriteria"
              id="eligibilityCriteria"
              value={formData.eligibilityCriteria}
              onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
              required
              rows="3"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter eligibility criteria"
            ></textarea>
          </div>

          {/* Required Documents */}
          <div>
            <label htmlFor="requiredDocuments" className="block text-lg font-medium text-gray-700">
              Required Documents
            </label>
            <textarea
              name="requiredDocuments"
              id="requiredDocuments"
              value={formData.requiredDocuments}
              onChange={(e) => setFormData({ ...formData, requiredDocuments: e.target.value })}
              required
              rows="3"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter required documents"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold text-lg transition-colors shadow-md hover:shadow-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLoanType;