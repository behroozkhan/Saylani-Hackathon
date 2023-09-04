
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
   getAuth,
   createUserWithEmailAndPassword,onAuthStateChanged
 } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
 import {
     getFirestore,doc,setDoc,
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

let regFlag = false;

onAuthStateChanged(auth, async (user) => {
 if (user) {
     const uid = user.uid;
     console.log('User uid-->', uid)
 } else {
     console.log('User is not logged in')
 }
});



// -------------------    Geeting Html Elemnts -----------------------------------------------------------------//

let nameInp = document.querySelectorAll("#name")[0];
let userInp = document.querySelectorAll("#username")[0];
let emailInp = document.querySelectorAll("#email")[0];
let passInp = document.querySelectorAll("#password")[0];
let cPassInp = document.querySelectorAll("#c-password")[0];
let signupForm = document.querySelectorAll("#signup-form")[0]; 
let loader = document.querySelectorAll("#loader")[0]; 

// ---------------------------   Register User -----------------------------------------------//
signupForm.addEventListener("submit", async (e) => {
 e.preventDefault();
 loader.style.display = 'block';
 let name = nameInp.value.toLowerCase();
 let userName = userInp.value.toLowerCase();
 let email = emailInp.value.toLowerCase();
 let password = passInp.value;
 let confirmPs = cPassInp.value;
 // regFalg = false;
       // Only proceed if regFlag is false (user has not registered before)
       try {
           const userCredential = await createUserWithEmailAndPassword(auth, email, password);
           const user = userCredential.user;

           const userInfo = {
               name,
               userName,
               email,
               uid: user.uid,
           };

           const hackathonRef = doc(db, "hackathon", user.uid);
           await setDoc(hackathonRef, userInfo);

           // regFlag = true;
           loader.style.display = 'none';
           Swal.fire({
             icon: "success",
             title: "User updated successfully",
           });
           window.location.href = '../html file/home.html';
       } catch (error) {
        
         console.log("error", error);
           const errorCode = error.code;
           const errorMessage = error.message;
           Swal.fire({
             icon: "error",
             title: "Oops...",
             text: errorMessage,
             footer: '<a href="">Why do I have this issue?</a>',
           });
           console.log("error", error);
       }

 // Clear input fields after signup
 nameInp.value = "";
 userInp.value = "";
 emailInp.value = "";
 passInp.value = "";
 cPassInp.value = "";
});
