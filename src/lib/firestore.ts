import { db } from "../../firebase/firebase.config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

export interface User {
  id?: string; // optional because Firestore generates it
  name: string;
  email: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
}


export const addUser = async (user: Omit<User, "id">): Promise<void> => {
  try {
    await addDoc(collection(db, "users"), user);
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};


export const getUsers = async (): Promise<User[]> => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<User, "id">),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};


export const updateUser = async (id: string, data: UpdateUser): Promise<void> => {
  try {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, data as Record<keyof UpdateUser, unknown>);
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
