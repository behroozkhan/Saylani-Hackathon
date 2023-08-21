
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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
const auth = getAuth();
const db = getFirestore(app);

let userInpLogin = document.querySelectorAll("#username-login")[0];
let passInpLogin = document.querySelectorAll("#password-login")[0];
// let throwMessage = document.querySelectorAll("#result")[0];
let loginBtn = document.querySelectorAll("#login-btn")[0];

const loginPage = () => {
  let email = userInpLogin.value.toLowerCase();
  let password = passInpLogin.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("user succefully login==>", user);
      window.location.href = "../html file/home.html"
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });


  // Clear input fields
  userInpLogin.value = "";
  passInpLogin.value = "";
}



onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("uid==> User Status",uid);
    // ...
  } else {
    console.log("user is not find")
  }
});
loginBtn.addEventListener('click', loginPage)
