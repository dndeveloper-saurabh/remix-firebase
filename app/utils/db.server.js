import admin from "firebase-admin";
import {
  applicationDefault,
  initializeApp as initializeAdminApp,
} from "firebase-admin/app";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";

require("dotenv").config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2CpLexBf7JVqwiMyFsOKyPB0x0PD7dsI",
  authDomain: "pustack-demo.firebaseapp.com",
  projectId: "pustack-demo",
  storageBucket: "pustack-demo.appspot.com",
  messagingSenderId: "671763442820",
  appId: "1:671763442820:web:fb83a119a877a81797a6d1"
};

if (!admin.apps.length) {
  initializeAdminApp({
    credential: applicationDefault(),
    databaseURL: "https://pustack-demo-default-rtdb.firebaseio.com",
  });
}

const db = admin.firestore();
const adminAuth = admin.auth();

let Firebase;

if (!Firebase?.apps?.length) {
  Firebase = initializeApp(firebaseConfig);
}

async function signIn(email, password) {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

async function signUp(email, password) {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password);
}

async function getSessionToken(idToken) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error("Recent sign in required");
  }
  const twoWeeks = 60 * 60 * 24 * 14 * 1000;
  return adminAuth.createSessionCookie(idToken, { expiresIn: twoWeeks });
}

async function signOutFirebase() {
  await signOut(getAuth());
}

export { db, signUp, getSessionToken, signOutFirebase, signIn, adminAuth };
