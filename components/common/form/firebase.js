// import { initializeApp, firebase } from "firebase/app";
import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAo9hmuIq-VJiU9Hc2QRBQC43236QS9rHI",
  authDomain: "immense-career.firebaseapp.com",
  projectId: "immense-career",
  storageBucket: "immense-career.appspot.com",
  messagingSenderId: "351436627626",
  appId: "1:351436627626:web:3956bcb0abb8cbef613ad3"
};
const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const auth = firebase.auth();
export default firebase;
export const storage = getStorage(app);
