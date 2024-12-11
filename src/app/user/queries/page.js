"use client";


import React, { useState, useEffect } from "react";
import { createQuery, getQueries } from "@/lib/queries"; 
import { getprofileData, verifyToken } from "@/lib/users";
import { toast } from "react-hot-toast";


const UserQueries = () => {
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState({ title: "", description: "" });
  const [user, setUser] = useState(null);


  useEffect(() => {
     const fetchData = async () => {
        try {
          const tokenData = await verifyToken();;
          const id = tokenData.id; 
          const userData = await getprofileData(id); 
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchData();
    
  }, []);

  const queryTitles = [
    { value: "emi-issue", label: "EMI Issue" },
    { value: "loan-status", label: "Loan Status" },
    { value: "payment-problem", label: "Payment Problem" },
    { value: "account-update", label: "Account Update" },
    { value: "other", label: "Other" },
  ];

  const fetchQueries = async () => {
    try {
       
      const response = await getQueries(user.id); 
      
      setQueries(response);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const handleCreateQuery = async () => {
    try {
      if (!newQuery.title || !newQuery.description) {
        toast.error("Please select a title and provide a description!");
        return;
      }

      const queryData = {
        ...newQuery,
        userId: user.id,
      };

      await createQuery(queryData , user.email);
      toast.success("submitted succesfully ..")
      setNewQuery({ title: "", description: "" });
      fetchQueries();
    } catch (error) {
      console.error("Error creating query:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchQueries(); 
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">Your Queries</h2>
      <div className="mb-6">
        {/* Dropdown for Title */}
        <label className="block mb-2 text-gray-700 font-semibold">
          Select Query Title
        </label>
        <select
          value={newQuery.title}
          onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
          className="w-full px-4 py-2 border rounded-md mb-4"
        >
          <option value="">Select a query type</option>
          {queryTitles.map((title) => (
            <option key={title.value} value={title.value}>
              {title.label}
            </option>
          ))}
        </select>

        {/* Description */}
        <textarea
          placeholder="Describe your issue or query..."
          value={newQuery.description}
          onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-md mb-4"
          rows="4"
        ></textarea>

        {/* Submit Button */}
        <button
          onClick={handleCreateQuery}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Query
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-4">Submitted Queries</h3>
      {queries.length > 0 ? (
        <ul className="space-y-4">
          {queries.map((query, index) => (
            <li key={index} className="p-4 border rounded-md shadow">
              <h4 className="font-bold text-blue-600">
                {queryTitles.find((q) => q.value === query.title)?.label || "Unknown"}
              </h4>
              <p>Description : {query.description}</p>
              {query.adminRemarks ? <p>Admin Remarks : {query.adminRemarks}</p> : ""}
              <p className="text-sm text-gray-500">Status: {query.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No queries found.</p>
      )}
    </div>
  );
};

export default UserQueries;