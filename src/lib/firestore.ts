import { db } from "../../firebase/firebase.config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

export interface User {
  id?: string;
  name: string;
  email: string;
  createdBy?: string | null; // admin uid who created the user
  createdAt?: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
}

export const addUser = async (user: Omit<User, "id" | "createdAt"> & { createdBy?: string | null }): Promise<void> => {
  try {
    await addDoc(collection(db, "users"), {
      ...user,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<User, "id">) }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateUser = async (id: string, data: UpdateUser): Promise<void> => {
  try {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, data as Record<string, unknown>);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", id);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};