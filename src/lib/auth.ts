import { auth, db } from "../../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


export const signupWithEmail = async (email: string, password: string, displayName?: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;
  // create an admins doc so this user is an admin in your app
  await setDoc(doc(db, "admins", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: displayName || null,
    createdAt: new Date().toISOString(),
  });
  return user;
};

export const loginWithEmail = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const logout = async () => {
  await signOut(auth);
};