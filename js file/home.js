// //==================   FireBase Initializing ==================================//


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,signOut
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

let postContainer = document.querySelectorAll(".blogs-container")[0];

let postForm = document.querySelectorAll("#post_form")[0];
let renderUserProfile = document.querySelectorAll("#render-image")[0];
const logOutUser = document.querySelectorAll("#log-Out")[0];

let loader = document.querySelectorAll("#loader")[0]; 

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log('User uid-->', uid)
       
        getPosts()
    
    } else {
        console.log('User is not logged in')


    }
});

postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loader.style.display = 'block';

    let postTitle = document.querySelectorAll("#post_title")[0].value;
    let postDescription = document.querySelectorAll("#post_desc")[0].value;

    try {
        const userInfo = await getUserInfo(auth.currentUser.uid);
        
        if (userInfo) {
            const postObj = {
                postTitle,
                postDescription,
                userUid: auth.currentUser.uid,
                userName: userInfo.name,
                userImg:userInfo.userProfileImgUrl,
                created_at: new Date().getTime().toString()
            }
            console.log("userInfo70",userInfo);
            const postRef = collection(db, 'bk_blogs');
            await addDoc(postRef, postObj);
            loader.style.display = 'none';
            console.log("postRef",postRef);
            Swal.fire({
                icon: "success",
                title: "Post Publish Succesfully",
              });
        } else {
            console.log("No user info found");
        }
        
    } catch (error) {
        console.log("Error getting user info:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            footer: '<a href="">Why do I have this issue?</a>',
          });
    }
    postTitle = "";
    postDescription = "";

    getPosts();
});
let getPosts = async () => {
    postContainer.innerHTML = ""; 
    loader.style.display = 'block';

    const q = query((collection(db, "bk_blogs")), where("userUid", "==", auth.currentUser.uid));

    const querySnapshot = await getDocs(q);
    postContainer.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const postInfo = doc.data();
        renderUserProfile.src =  doc.data().userImg;
        const { postTitle, created_at, userName, postDescription,userImg } = postInfo;
        console.log("userImg109",userImg);
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
            <p>${postDescription  || ''}</p>
        </div>
        
   
            <div class="btn">
                <button class='button-bk '  id="edit-post" onclick="editPost()">Edit</button>
                <button class='button-bk ' id="delete-post" onclick="deletePost()">Delete</button>
            </div>
        </div>  
        </div>
    `;

        postContainer.innerHTML += card;
        

    });
    loader.style.display = 'none';
};

const deletePost = () =>{
        console.log("hey i Am Delete baby");
}







let  getUserInfo = async(uid)=> {
    const userRef = doc(db, "hackathon", uid)
    const docSnap = await getDoc(userRef);
    let info = null
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        console.log("renderUserProfile",renderUserProfile);
        info = docSnap.data(
        )
    } else {
        console.log("No such document!");
    }

    return info
}


const logOut = ()=>{
    signOut(auth)
    .then(() => {
      location.href = "../index.html";
    })
    .catch((error) => {
      console.log("Error while signing out:", error);
    });
}
logOutUser.addEventListener("click",logOut)

window.deletePost = deletePost;