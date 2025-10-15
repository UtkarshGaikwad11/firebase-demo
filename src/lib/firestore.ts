// lib/firestore.ts
import { db } from "../../firebase/firebase.config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

// CREATE
export const addUser = async (user: { name: string; email: string }) => {
  await addDoc(collection(db, "users"), user);
};

// READ
export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// UPDATE
export const updateUser = async (id: string, data: any) => {
  const userRef = doc(db, "users", id);
  await updateDoc(userRef, data);
};

// DELETE
export const deleteUser = async (id: string) => {
  const userRef = doc(db, "users", id);
  await deleteDoc(userRef);
};
