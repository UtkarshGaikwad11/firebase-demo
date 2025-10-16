"use client";

import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.config";
import { useAuth } from "@/context/AuthContext";
import { Pencil, Trash2, Plus, Users, Mail, User, X, Check } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface UserData {
  id?: string;
  name: string;
  email: string;
}

const CrudDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validation Schema
  const userSchema = Yup.object({
    name: Yup.string().min(2, "Too short").max(50, "Too long").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  // Fetch only logged-in admin's users
  const fetchUsers = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const q = query(collection(db, "users"), where("adminId", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as UserData)
      );
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  // Add user form
  const addFormik = useFormik({
    initialValues: { name: "", email: "" },
    validationSchema: userSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!user) return;
      try {
        await addDoc(collection(db, "users"), { ...values, adminId: user.uid });
        resetForm();
        fetchUsers();
      } catch (error) {
        console.error("Failed to add user:", error);
      }
    },
  });

  // Edit user form
  const editFormik = useFormik({
    initialValues: { name: "", email: "" },
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!editingUser?.id) return;
      try {
        const ref = doc(db, "users", editingUser.id);
        await updateDoc(ref, values);
        setEditingUser(null);
        editFormik.resetForm();
        fetchUsers();
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    },
  });

  const startEdit = (user: UserData) => {
    setEditingUser(user);
    editFormik.setValues({ name: user.name, email: user.email });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    editFormik.resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Users</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>
        </div>

      </div>

      {/* Add User Form */}
      <div className="bg-white/90 backdrop-blur-lg shadow-lg rounded-2xl p-6 mb-8 border border-indigo-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Plus size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Add New User</h3>
        </div>

        <form onSubmit={addFormik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={addFormik.values.name}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    addFormik.touched.name && addFormik.errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                />
              </div>
              {addFormik.touched.name && addFormik.errors.name && (
                <p className="text-red-500 text-sm mt-1.5 ml-1">
                  {addFormik.errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={addFormik.values.email}
                  onChange={addFormik.handleChange}
                  onBlur={addFormik.handleBlur}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    addFormik.touched.email && addFormik.errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                  }`}
                />
              </div>
              {addFormik.touched.email && addFormik.errors.email && (
                <p className="text-red-500 text-sm mt-1.5 ml-1">
                  {addFormik.errors.email}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add User
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white/90 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-indigo-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Users Directory</h3>
          </div>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {users.length} {users.length === 1 ? "user" : "users"}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No users yet</p>
            <p className="text-gray-400 text-sm">Add your first user to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u, index) => (
              <div
                key={u.id}
                className="p-4 border border-gray-200 rounded-xl bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:shadow-md"
              >
                {editingUser?.id === u.id ? (
                  <form
                    onSubmit={editFormik.handleSubmit}
                    className="flex flex-col md:flex-row gap-3"
                  >
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={editFormik.values.name}
                        onChange={editFormik.handleChange}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={editFormik.values.email}
                        onChange={editFormik.handleChange}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-lg hover:bg-green-600 font-medium transition-colors"
                      >
                        <Check size={16} />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2.5 rounded-lg hover:bg-gray-500 font-medium transition-colors"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 mb-0.5">{u.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={14} />
                          {u.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(u)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium transition-all duration-200 hover:shadow-md"
                      >
                        <Pencil size={16} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(u.id!)}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium transition-all duration-200 hover:shadow-md"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrudDashboard;