import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut, EmailAuthProvider, reauthenticateWithCredential, updatePassword,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc, getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKckeGedMbGSj7NpxFk3siDAXkzd-yGU0",
  authDomain: "friend-hackthon.firebaseapp.com",
  databaseURL: "https://friend-hackthon-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "friend-hackthon",
  storageBucket: "friend-hackthon.appspot.com",
  messagingSenderId: "229955689782",
  appId: "1:229955689782:web:29c41164559f544a626797",
  measurementId: "G-ZST5B4N4VQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const allBlogsContainer = document.querySelectorAll(".post-container")[0];
const renderImg = document.querySelectorAll("#render-img")[0];
const userProfileRendering = document.querySelectorAll("#user-img-profile")[0];
const name = document.querySelectorAll("#user-profile-name")[0];
const email = document.querySelectorAll("#user-profile-email")[0];
let loader = document.querySelectorAll("#loader")[0];



onAuthStateChanged(auth,(user)=>{
    if(user){
        const uid = user.uid;
        getUserAllBlogs(uid)
        getUserInfo()
    }
})




const getUserAllBlogs = async() => {
    
    try {
        const urlParams = new URLSearchParams(location.search);
        const userParam = urlParams.get('user');
        console.log("userParam",userParam);
        loader.style.display = 'block';
        const q = query((collection(db, "bk_blogs")), where("userUid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
       
        querySnapshot.forEach((doc) => {
            const postInfo = doc.data();
            renderImg.src = doc.data().userImg;
            console.log(doc.id, " =>72 ", doc.data().userName);
            const { postTitle, created_at, userName, postDescription, userImg } = postInfo;
            const card = `
            <div class="card">
            <div class="img-name">
              <img id="user-img"  src="${userImg ? userImg : '../images/user-defoult.png'}" alt="">
            <div class="name-date-container">
                <h3>${userName || 'Unknown User'}</h3>
                <span>${created_at ? new Date(Number(created_at)).toLocaleDateString() : ''}</span>
            </div>
            </div>
            <div class="title-desc-container">
                <h2>${postTitle || ''}</h2>
                <p>${postDescription || ''}</p>
            </div>
            </div>
        `;
       allBlogsContainer.innerHTML += card;
        });
      } catch (error) {
       Swal.fire({
           icon: "error",
           title: "Oops...",
           text: error,
           footer: '<a href="">Why do I have this issue?</a>',
       });
       console.log("error",error);
      }
       loader.style.display = 'none';
}


let getUserInfo = async (uid) => {
    try {
        
    loader.style.display = 'block';
    const q = query((collection(db, "hackathon"))
    , where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      name.innerHTML = doc.data().name;
      email.innerHTML = doc.data().email;
      if (doc.data().userProfileImgUrl) {
        userProfileRendering.src = doc.data().userProfileImgUrl;
        console.log("userprofile",userProfileRendering);
      }
      console.log(" doc.data()==>8888", doc.data());
    });
    } catch (error) {
        
    }
  
    loader.style.display = 'none';
  
  }
  