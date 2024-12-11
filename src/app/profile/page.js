'use client';
import { getprofileData } from '@/lib/users';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';


const Profile = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      const id = decoded.id;

      const fetchData = async () => {
        try {
          const userData = await getprofileData(id);
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      };

      fetchData();
    }
  }, []);

  if (!user) {
    return <div className="text-center text-gray-700 mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 py-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center space-x-6">
          <img
            src={user.profileImageUrl}
            alt={`${user.firstName}'s Profile`}
            className="w-32 h-32 object-cover rounded-full shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600 text-lg">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-800 font-semibold">Username</p>
            <p className="text-gray-600">{user.userName}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-800 font-semibold">Phone Number</p>
            <p className="text-gray-600">{user.phoneNumber}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-800 font-semibold">Gender</p>
            <p className="text-gray-600">{user.gender}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-800 font-semibold">Date of Birth</p>
            <p className="text-gray-600">
              {new Date(user.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-800 font-semibold">Account Created On</p>
          <p className="text-gray-600">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {user.isAdmin && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <p className="text-blue-700 font-semibold">Admin Access</p>
            <p className="text-gray-600">You have administrator privileges.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;