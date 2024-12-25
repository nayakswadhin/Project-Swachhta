"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Import from next/navigation

export default function RoRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    roCode: "",
    name: "",
    location: {
      region: "",
      state: "",
      pincode: "",
    },
    contact: {
      email: "",
      phone: "",
    },
    officerInCharge: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/ro/register", formData);
      toast.success("Registration successful!");
      router.push("/ro/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Regional Office
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div>
              <label
                htmlFor="doCode"
                className="block text-sm font-medium text-gray-700"
              >
                RO Code
              </label>
              <input
                type="text"
                name="doCode"
                id="doCode"
                required
                value={formData.roCode}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Office Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Location Details
              </h3>
              <div>
                <label
                  htmlFor="location.address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="location.address"
                  id="location.address"
                  required
                  value={formData.location.address}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="location.city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    id="location.city"
                    required
                    value={formData.location.city}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="location.state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    name="location.state"
                    id="location.state"
                    required
                    value={formData.location.state}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="location.pincode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pincode
                </label>
                <input
                  type="text"
                  name="location.pincode"
                  id="location.pincode"
                  required
                  value={formData.location.pincode}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Officer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Officer Details
              </h3>
              <div>
                <label
                  htmlFor="officerInCharge.name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Officer Name
                </label>
                <input
                  type="text"
                  name="officerInCharge.name"
                  id="officerInCharge.name"
                  required
                  value={formData.officerInCharge.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="officerInCharge.email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Officer Email
                </label>
                <input
                  type="email"
                  name="officerInCharge.email"
                  id="officerInCharge.email"
                  required
                  value={formData.officerInCharge.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="officerInCharge.phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Officer Phone
                </label>
                <input
                  type="tel"
                  name="officerInCharge.phone"
                  id="officerInCharge.phone"
                  required
                  value={formData.officerInCharge.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="officerInCharge.password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="officerInCharge.password"
                  id="officerInCharge.password"
                  required
                  value={formData.officerInCharge.password}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
