// //==================   FireBase Initializing ==================================//


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
    getFirestore, collection,
    query, where,
    addDoc, doc, getDoc, getDocs
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


let loader = document.querySelectorAll("#loader")[0];
const allBlogsContainer = document.querySelectorAll(".post-container")[0];
const renderImg = document.querySelectorAll("#render-img")[0];



onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log('User uid-->', uid)
        getAllBlogs()
    } else {
        console.log('User is not logged in')


    }
});







const getAllBlogs = async () => {
    loader.style.display = 'block';
    const querySnapshot = await getDocs(collection(db, "bk_blogs"));
    querySnapshot.forEach((doc) => {
        const postInfo = doc.data();
        renderImg.innerHTML = doc.data().userImg;
        const { postTitle, created_at, userName, postDescription, userImg } = postInfo;
        console.log("postInfo55", postInfo);

        allBlogsContainer.innerHTML += `
        <div class="card">
        <div class="img-name">
          <img id="user-img"  src="${userImg ? userImg : '../images/user-defoult.png'}" alt="">
        <div class="name-date-container">
            <h3>${userName || 'Unknown User'}</h3>
            <span>published ${created_at ? new Date(Number(created_at)).toLocaleDateString() : ''}</span>
        </div>
        </div>

        <div class="title-desc-container">
            <h2>${postTitle || ''}</h2>
            <p>${postDescription || ''}</p>
        </div>

    </div>
     `
    });

    loader.style.display = 'none';
}



