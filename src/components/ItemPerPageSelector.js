"use client";
import React from 'react';

const ItemsPerPageSelector = ({ setLimit }) => {
  const handleSelectChange = (event) => {
    const selectedLimit = parseInt(event.target.value);
    setLimit(selectedLimit);
  };

  return (
    <div className="flex items-center">
      <label htmlFor="itemsPerPage" className="mr-2 text-gray-700 font-medium">
        Items per page:
      </label>
      <select id="itemsPerPage" onChange={handleSelectChange} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
    </div>
  );
};

export default ItemsPerPageSelector;