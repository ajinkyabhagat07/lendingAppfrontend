'use client';
import React from "react";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaListAlt,
  FaMoneyCheckAlt,
  FaFileInvoiceDollar,
  FaQuestionCircle,
  FaExclamationTriangle,
  FaPlusCircle,
  FaEnvelope,
  FaBan,
} from "react-icons/fa";

const Dashboard = () => {
  const router = useRouter();

  const sections = [
    {
      title: "Users",
      icon: <FaUsers size={50} className="text-blue-600" />,
      bgColor: "bg-blue-50",
      route: "/admin/users",
    },
    {
      title: "Create Loan Category",
      icon: <FaPlusCircle size={50} className="text-teal-600" />,
      bgColor: "bg-teal-50",
      route: "/admin/create-loan-type",
    },
    {
      title: "Loan Categories",
      icon: <FaListAlt size={50} className="text-green-600" />,
      bgColor: "bg-green-50",
      route: "/admin/loan-types",
    },
    {
      title: "Loan Requests",
      icon: <FaQuestionCircle size={50} className="text-yellow-600" />,
      bgColor: "bg-yellow-50",
      route: "/admin/loan-requests",
    },
    {
      title: "Loans",
      icon: <FaMoneyCheckAlt size={50} className="text-purple-600" />,
      bgColor: "bg-purple-50",
      route: "/admin/loans",
    },
    {
        title: "Rejected Loans",
        icon: <FaBan size={50} className="text-gray-600" />,
        bgColor: "bg-gray-50",
        route: "/admin/rejected-loans",
      },
    {
      title: "EMIs",
      icon: <FaFileInvoiceDollar size={50} className="text-orange-600" />,
      bgColor: "bg-orange-50",
      route: "/admin/emis",
    },
    {
      title: "Non-Performing Assets",
      icon: <FaExclamationTriangle size={50} className="text-red-600" />,
      bgColor: "bg-red-50",
      route: "/admin/non-performing-assets",
    },
    {
      title: "User Queries",
      icon: <FaEnvelope size={50} className="text-indigo-600" />,
      bgColor: "bg-indigo-50",
      route: "/admin/user-queries",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center py-4">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              onClick={() => router.push(section.route)}
              className={`${section.bgColor} flex flex-col items-center justify-center shadow-lg rounded-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer`}
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mb-4">
                {section.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mt-4 text-center">
                {section.title}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;