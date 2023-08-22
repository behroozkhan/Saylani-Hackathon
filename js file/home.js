// //==================   FireBase Initializing ==================================//


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged, 
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
    getFirestore, collection,
    query, where,
    addDoc, doc, getDoc, getDocs, setDoc
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

let postContainer = document.querySelectorAll(".container-body")[0];

let postForm = document.querySelectorAll("#post_form")[0];



onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log('User uid-->', uid)
        // location.href = "../index.html"
        // loader_container.style.display = 'none'
        // createAccountContainer.style.display = 'none'
        // content_container.style.display = 'block'
        getPosts()
        // const info = await getUserInfo(uid)
        // welcome.innerHTML = `Welcome ${info.name}`
        // ...
    } else {
        console.log('User is not logged in')
        // loader_container.style.display = 'none'
        // createAccountContainer.style.display = 'block'
        // content_container.style.display = 'none'

    }
});

postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
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
                userImg:userInfo.profileImageUrl,
                created_at: new Date().getTime().toString()
            }

            const postRef = collection(db, 'hackathon');
            await addDoc(postRef, postObj);
            
        } else {
            console.log("No user info found");
        }
    } catch (error) {
        console.error("Error getting user info:", error);
    }
    getPosts();
    postForm.reset();
});

let  getUserInfo = async(uid)=> {
    const userRef = doc(db, "hackathon", uid)
    const docSnap = await getDoc(userRef);
    let info = null
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        info = docSnap.data(
        )
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }

    return info
}

let getPosts = async () => {
    const q = query(collection(db, "hackathon"), where("userUid", "==", auth.currentUser.uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const postInfo = doc.data();
        console.log("postInfo==>\\",postInfo);
        const { postTitle, created_at, userName, postDescription,userImg } = postInfo;
        
            const card = `
            <div class="card">
            <div class="card-under">
            <img id='user-img'  src="${userImg}" alt="User Profile">
            <div class="card-title">
                ${postTitle}:
            </div>
                <div class="card-title card-userInfo">  
                    <span id='post-userName'> (${userName} </span> 
                    <span id='post-date'> ${new Date(Number(created_at)).toLocaleDateString()} ) </span> 
                </div>
                </div>
                <div class="card-body-desc">${postDescription}</div>
                <div class="btn">
                <button class='button-bk '  id="edit-post">Edit</button>
                <button class='button-bk ' id="delete-post">Delete</button>
                </div>
            </div>  
        `;

        postContainer.innerHTML += card;
    });
    // postContainer.innerHTML = "";

   
};
