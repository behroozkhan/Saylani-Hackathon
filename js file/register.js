
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
 import {
    getAuth,
    createUserWithEmailAndPassword
  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
  import {
      getFirestore,doc,setDoc,collection,addDoc,updateDoc
  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyDKckeGedMbGSj7NpxFk3siDAXkzd-yGU0",
    authDomain: "friend-hackthon.firebaseapp.com",
    projectId: "friend-hackthon",
    storageBucket: "friend-hackthon.appspot.com",
    messagingSenderId: "229955689782",
    appId: "1:229955689782:web:29c41164559f544a626797",
    measurementId: "G-ZST5B4N4VQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let nameInp = document.querySelector("#name");
let userInp = document.querySelector("#username");
let emailInp = document.querySelector("#email");
let passInp = document.querySelector("#password");
let cPassInp = document.querySelector("#c-password");
let signupForm = document.querySelector("#signup-form"); 


signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let name = nameInp.value.toLowerCase();
  let userName = userInp.value.toLowerCase();
  let email = emailInp.value.toLowerCase();
  let password = passInp.value;
  let confirmPs = cPassInp.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("user-register", user);

    const userInfo = {
      name,
      userName,
      email,
      uid: user.uid,
    };

    const hackthonRef = doc(db, "hackathon", user.uid); 
    console.log("hackathonRef", hackthonRef);
    await setDoc(hackthonRef, userInfo);

    console.log("user Sign Up");
    window.location.href = "../html file/home.html";

  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("error", error);
  }

  // Clear input fields after signup
  nameInp.value = "";
  userInp.value = "";
  emailInp.value = "";
  passInp.value = "";
  cPassInp.value = "";
});
