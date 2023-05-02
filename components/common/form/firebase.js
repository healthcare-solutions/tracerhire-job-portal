// import { initializeApp, firebase } from "firebase/app";
import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";
const firebaseConfig = {
    apiKey: "AIzaSyB1a9gamx04kJ2vnzeqQ8N1bMqWRt0eXRc",
    authDomain: "tracerhire.firebaseapp.com",
    projectId: "tracerhire",
    storageBucket: "tracerhire.appspot.com",
    messagingSenderId: "643269423744",
    appId: "1:643269423744:web:3e3d9df6c4d8406ea8ec65"
};
const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const auth = firebase.auth();
export default firebase;
export const storage = getStorage(app);