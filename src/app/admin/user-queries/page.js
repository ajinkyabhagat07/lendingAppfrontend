"use client";

import React, { useState, useEffect } from "react";
import { FaInfoCircle, FaTrashAlt } from "react-icons/fa";
import { deleteQuery, updateQueryRemark, getAllQueries } from "@/lib/queries";
import ItemsPerPageSelector from "@/components/ItemPerPageSelector";
import Pagination from "@/components/Pagination";
import { toast } from "react-hot-toast";

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const [queryToDelete, setQueryToDelete] = useState(null);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1); 

  const fieldsToDisplay = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" },
    { key: "adminRemarks", label: "Admin Remarks" },
  ];

  
  const fetchQueries = async () => {
    try {
      const filterParams = {status : "Pending"}
      const response = await getAllQueries(filterParams,limit, page);
      setQueries(response);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [limit, page]);

 
  const handleDeleteQuery = async () => {
    if (!queryToDelete) return;
    try {
      await deleteQuery(queryToDelete.id);
      toast.success("Query deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchQueries();
    } catch (error) {
      console.error("Error deleting query:", error);
      toast.error("Failed to delete query. Please try again.");
    }
  };

  
  const handleUpdateRemark = async () => {
    try {
      const email = selectedQuery.user.email;
      const data = { adminRemarks: remark, status: "Resolved", email };

      await updateQueryRemark(selectedQuery.id, data);
      toast.success("Remark updated successfully, and query resolved!");
      setIsRemarkModalOpen(false);
      fetchQueries();
    } catch (error) {
      console.error("Error updating remark:", error);
      toast.error("Failed to update remark. Please try again.");
    }
  };

  // Table Header
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
      <th className="px-6 py-3 text-center min-w-[200px] border-l border-gray-200 uppercase">
        Actions
      </th>
    </>
  );

  // Table Data
  const tableData = queries.map((query, index) => (
    <tr
      key={query.id || index}
      className="hover:bg-gray-100 border-b last:border-b-0"
    >
      {fieldsToDisplay.map((keyName, cellIndex) => (
        <td
          key={cellIndex}
          className="px-6 py-4 border-l border-gray-200 text-gray-700 min-w-[150px] last:border-r"
        >
          {keyName.key === "id" ? index + 1 : query[keyName.key]}
        </td>
      ))}
      <td className="px-6 py-4 text-center border-l border-gray-200 text-gray-700 last:border-r">
        <div className="flex justify-center items-center space-x-2">
          <FaInfoCircle
            className="text-blue-600 cursor-pointer hover:text-blue-800"
            onClick={() => {
              setSelectedQuery(query);
              setRemark(query.adminRemarks || "");
              setIsRemarkModalOpen(true);
            }}
            title="Add/Update Remark"
          />
          <FaTrashAlt
            className="text-red-600 cursor-pointer hover:text-red-800"
            onClick={() => {
              setQueryToDelete(query);
              setIsDeleteModalOpen(true);
            }}
            title="Delete Query"
          />
        </div>
      </td>
    </tr>
  ));

  return (
    <div className="max-w-7xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
     
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">User Queries</h2>
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
                  No pending queries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} setPage={setPage}/>
      </div>

      
      {isRemarkModalOpen && selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4 text-blue-700">Update Remark</h3>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4"
              rows="4"
              placeholder="Add or update remark..."
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsRemarkModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRemark}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

     
      {isDeleteModalOpen && queryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4 text-red-700">
              Confirm Deletion
            </h3>
            <p className="text-gray-700">
              Are you sure you want to delete the query titled "
              <strong>{queryToDelete.title}</strong>"?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuery}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQueries;