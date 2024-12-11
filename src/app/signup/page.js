"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import photoUrlService from "@/utils/photoUrlService";
import { submitSignUp } from "@/lib/users";

const SignUp = () => {
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "Male",
        dateOfBirth: "",
        isAdmin: false,
        profileImageUrl: "",
    });

    const [profilePhoto, setProfilePhoto] = useState(null);
    const [uploadedProfileUrl, setUploadedProfileUrl] = useState("");

    const router = useRouter();

    const handleProfilePhotoChange = (e) => {
        setProfilePhoto(e.target.files[0]);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const profileUrl = profilePhoto ? await photoUrlService(profilePhoto) : "";
            setUploadedProfileUrl(profileUrl);
            const finalFormData = { ...formData, profileImageUrl: profileUrl };

            const response = await submitSignUp(finalFormData);

            if (response) {
                alert("Signup successful!");
                router.push("/login");
            } else {
                alert("Failed to signup. Please try again.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred during signup. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 pt-5">
            <div className="w-full max-w-2xl p-10 space-y-8 bg-white rounded-lg shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-blue-600">
                    Create an Account
                </h2>
                <form onSubmit={handleSignUp} className="space-y-6">
                    {/* Username */}
                    <div>
                        <label htmlFor="userName" className="block text-sm font-semibold text-gray-700">
                            Username
                        </label>
                        <input
                            id="userName"
                            name="userName"
                            type="text"
                            required
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your first name"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your last name"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700">
                            Phone Number
                        </label>
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            required
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
                            Gender
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            required
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Profile Photo */}
                    <div>
                        <label htmlFor="profilePhoto" className="block text-sm font-semibold text-gray-700">
                            Profile Photo
                        </label>
                        <input
                            id="profilePhoto"
                            name="profilePhoto"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePhotoChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Display Uploaded Photo */}
                    {uploadedProfileUrl && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-700 font-medium">Uploaded Profile Photo:</p>
                            <img
                                src={uploadedProfileUrl}
                                alt="Uploaded Profile"
                                className="w-32 h-32 object-cover rounded-md shadow-md border"
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none shadow-lg"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;