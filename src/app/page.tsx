"use client";

import React, { useState, useEffect } from "react";
import { addUser, getUsers, updateUser, deleteUser, User as FirestoreUser } from "@/lib/firestore";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation schemas
const userValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function HomePage() {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [editingUser, setEditingUser] = useState<FirestoreUser | null>(null);

  // Load all users
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user form with Formik
  const addFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await addUser(values);
        resetForm();
        fetchUsers();
      } catch (error) {
        console.error("Failed to add user:", error);
      }
    },
  });

  // Edit user form with Formik
  const editFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: userValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!editingUser?.id) return;
      try {
        await updateUser(editingUser.id, values);
        setEditingUser(null);
        editFormik.resetForm();
        fetchUsers();
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    },
  });

  // Start editing
  const startEdit = (user: FirestoreUser) => {
    setEditingUser(user);
    editFormik.setValues({
      name: user.name,
      email: user.email,
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    editFormik.resetForm();
  };

  // Delete user
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-2xl">
              🔥
            </div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          </div>

          {/* Add User Form with Formik */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New User</h2>
            <form onSubmit={addFormik.handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    className={`border-2 ${
                      addFormik.touched.name && addFormik.errors.name
                        ? "border-red-400"
                        : "border-gray-200"
                    } p-3 w-full rounded-lg focus:border-blue-500 focus:outline-none transition-colors`}
                    placeholder="Full Name"
                    name="name"
                    value={addFormik.values.name}
                    onChange={addFormik.handleChange}
                    onBlur={addFormik.handleBlur}
                  />
                  {addFormik.touched.name && addFormik.errors.name && (
                    <p className="text-red-500 text-xs mt-1">{String(addFormik.errors.name)}</p>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    className={`border-2 ${
                      addFormik.touched.email && addFormik.errors.email
                        ? "border-red-400"
                        : "border-gray-200"
                    } p-3 w-full rounded-lg focus:border-blue-500 focus:outline-none transition-colors`}
                    placeholder="Email Address"
                    type="email"
                    name="email"
                    value={addFormik.values.email}
                    onChange={addFormik.handleChange}
                    onBlur={addFormik.handleBlur}
                  />
                  {addFormik.touched.email && addFormik.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{String(addFormik.errors.email)}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={addFormik.isSubmitting}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={18} />
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Users List ({users.length})
          </h2>

          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No users yet. Add your first user above! 👆</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border-2 border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white"
                >
                  {editingUser?.id === user.id ? (
                    <form onSubmit={editFormik.handleSubmit}>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <input
                              className={`border-2 ${
                                editFormik.touched.name && editFormik.errors.name
                                  ? "border-red-400"
                                  : "border-blue-300"
                              } p-3 w-full rounded-lg focus:border-blue-500 focus:outline-none`}
                              placeholder="Name"
                              name="name"
                              value={editFormik.values.name}
                              onChange={editFormik.handleChange}
                              onBlur={editFormik.handleBlur}
                            />
                            {editFormik.touched.name && editFormik.errors.name && (
                              <p className="text-red-500 text-xs mt-1">{String(editFormik.errors.name)}</p>
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              className={`border-2 ${
                                editFormik.touched.email && editFormik.errors.email
                                  ? "border-red-400"
                                  : "border-blue-300"
                              } p-3 w-full rounded-lg focus:border-blue-500 focus:outline-none`}
                              placeholder="Email"
                              type="email"
                              name="email"
                              value={editFormik.values.email}
                              onChange={editFormik.handleChange}
                              onBlur={editFormik.handleBlur}
                            />
                            {editFormik.touched.email && editFormik.errors.email && (
                              <p className="text-red-500 text-xs mt-1">{String(editFormik.errors.email)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={editFormik.isSubmitting}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ✓ Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">👤</span>
                          <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-8">
                          <span className="text-sm">📧</span>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(user)}
                          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                        >
                          <Pencil size={18} />
                          Edit
                        </button>
                        <button
                          onClick={() => user.id && handleDelete(user.id)}
                          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                        >
                          <Trash2 size={18} />
                          Delete
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
    </div>
  );
}