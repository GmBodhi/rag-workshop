"use client";
import { Database, Bot, Sparkles } from "lucide-react";
import React, { useState } from "react";

const api = "https://rag-workshop-registration.exstd.workers.dev/";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    semester: "",
    branch: "",
    phone_number: "",
    college: "",
  });

  const [loading, setLoading] = useState(false);
const cardId = localStorage.getItem('card');

if (cardId) window.location.href = '/card/' + cardId;

  const validateForm = (formData) => {
    if (!formData.fullName) return "Full name is required";
    if (!formData.email) return "Email is required";
    if (!formData.phone_number || formData.phone_number.length !== 10)
      return "Phone number is required and should be 10 digits";
    if (!formData.semester) return "Semester is required";
    if (!formData.branch) return "Branch is required";
    if (!formData.college) return "College is required";
    return null;
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    console.log("Form submitted:", formData);

    const v = validateForm(formData);
    if (v) {
      alert(v);
      setLoading(false);
      return;
    }

    fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data);
        if (data.success) {
           window.location.href = "/card/" + data.id;
           localStorage.setItem('card', data.id);
        }
        else {
          alert(data?.errors?.join?.(", ") || "Failed to submit registration");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Registration failed!");
      })
      .finally(() => setLoading(false));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 flex items-center justify-center">
      {/* Main Container */}
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-4 mb-4">
            <Database className="w-10 h-10 text-blue-400" />
            <Bot className="w-10 h-10 text-purple-400" />
            <Sparkles className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
            RAG Workshop Registration
          </h1>
          <p className="text-gray-400">
            Join us to master intelligent search systems with LLMs
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition duration-200"
                placeholder="Enter your full name"
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition duration-200"
                placeholder="your.email@example.com"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone_number}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition duration-200"
                placeholder="Enter your phone number"
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
              />
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <label className="block text-sm font-medium bg-gradient-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">
                Semester
              </label>
              <select
                required
                value={formData.semester}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition duration-200"
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
              >
                <option value="" className="bg-gray-800">
                  Select semester
                </option>
                {Array.from({ length: 8 }, (_, i) => (
                  <option
                    key={i + 1}
                    value={`s${i + 1}`}
                    className="bg-gray-800"
                  >
                    S{i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <label className="block text-sm font-medium bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
                Branch
              </label>
              <input
                type="text"
                required
                value={formData.branch}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition duration-200"
                placeholder="Enter your branch"
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
              />
            </div>

            {/* College */}
            <div className="space-y-2">
              <label className="block text-sm font-medium bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                College
              </label>
              <input
                type="text"
                required
                value={formData.college}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-400/50 focus:border-transparent transition duration-200"
                placeholder="Enter your college name"
                onChange={(e) =>
                  setFormData({ ...formData, college: e.target.value })
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition duration-200 focus:ring-2 focus:ring-purple-400/50"
            >
              Register Now
            </button>
          </form>
        </div>

        <div className="relative bg-gray-900/30 border border-gray-800/50 rounded-2xl shadow-[0_0_30px_rgba(120,119,198,0.1)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80"></div>
          <div className="relative p-6">
            <div className="flex items-start gap-4 group hover:bg-gray-800/30 p-2 rounded-xl transition-all duration-300">
              <Database className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Learn vector databases and embeddings
              </p>
            </div>
            <div className="flex items-start gap-4 group hover:bg-gray-800/30 p-2 rounded-xl transition-all duration-300">
              <Bot className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Master prompt engineering techniques
              </p>
            </div>
            <div className="flex items-start gap-4 group hover:bg-gray-800/30 p-2 rounded-xl transition-all duration-300">
              <Sparkles className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Build real-world RAG applications
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
