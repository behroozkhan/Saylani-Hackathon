// //==================   FireBase Initializing ==================================//
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
    getFirestore, collection,
    query, where,
    addDoc, doc, getDoc, getDocs, deleteDoc, updateDoc
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
let editModal = document.querySelectorAll(".modal-card")[0];
let closeModal = document.querySelectorAll(".close-modal")[0];
let updatedDesc = document.querySelectorAll("#edit_desc")[0];
let upadtedTitle = document.querySelectorAll("#edit-title")[0];
let cancelEdit = document.querySelectorAll("#cancel-post")[0];
let UpdateBlogPost = document.querySelectorAll("#update-post")[0];
let updateEditId = "";


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
        const postObj = {
            postTitle,
            postDescription,
            userUid: auth.currentUser.uid,
            userName: userInfo.name,
            userImg: userInfo ? userInfo.userProfileImgUrl : '../images/user-default.png',
            created_at: new Date().getTime().toString(),
        }
        console.log("userInfo70", userInfo);
        const postRef = collection(db, 'bk_blogs');
        await addDoc(postRef, postObj);
        loader.style.display = 'none';
        console.log("postRef", postRef);
        postTitle = "";
        postDescription = "";
        Swal.fire({
            icon: "success",
            title: "Post Publish Succesfully",
        });
    } catch (error) {
        console.log("Error getting user info:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            footer: '<a href="">Why do I have this issue?</a>',
        });
    }
    getPosts();

});


let getPosts = async () => {
    try {
        loader.style.display = 'block';
        const q = query((collection(db, "bk_blogs")), where("userUid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        postContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const postInfo = doc.data();
            renderUserProfile.src = doc.data().userImg;
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
             <div class="btn">
         <button class='button-bk'  id="edit-post" onclick="editPost('${doc.id}')">Edit</button>
         <button class='button-bk ' id="delete-post" onclick="deletePost('${doc.id}')">Delete</button>

         <div class="anchor-param"><a class="user-param" href="../html file/usercomplete.html?user=${doc.data().userUid}">See All From This User...</a>
         </div>
         

             </div>
         </div>  
         </div>
     `;
            postContainer.innerHTML += card;
        });
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            footer: '<a href="">Why do I have this issue?</a>',
        });
    }
    loader.style.display = 'none';
};

// Edit Post User Select The Edit Button Modal Will Be Open And User Edit Thier Uploaded Post
const editPost = (id) => {
    try {
        updateEditId = id;
        console.log("Editing post with ID:", id);
        const postRef = doc(db, "bk_blogs", id);
        getDoc(postRef).then((postSnapshot) => {
            if (postSnapshot.exists()) {
                const postData = postSnapshot.data();
                const { postTitle, postDescription } = postData;
                upadtedTitle.value = postTitle;
                updatedDesc.value = postDescription;
            }

            editModal.style.display = 'block';
        });

    } catch (error) {
        console.error("Error retrieving post data:", error)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            footer: '<a href="">Why do I have this issue?</a>',
        });
    }
};

const upadetPost = async () => {

    try {
        console.log(upadtedTitle.value, updatedDesc.value, updateEditId);
        const editBlogPostRef = doc(db, 'bk_blogs', updateEditId);
        await updateDoc(editBlogPostRef, {
            postTitle: upadtedTitle.value,
            postDescription: updatedDesc.value,
        });
        Swal.fire({
            icon: "success",
            title: "Post Edit Succesfully",
        });
        updateEditId = '';
        editModal.style.display = 'none';
        getPosts();

    } catch (error) {
        console.log("Error getting user info:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            footer: '<a href="">Why do I have this issue?</a>',
        });
    }
}
cancelEdit.addEventListener('click', () => {
    editModal.style.display = 'none';
})

// Delete Logic Here This Publish Data Will Be deleted into the firebase
const deletePost = async (id) => {
    try {
        loader.style.display = 'block';
        console.log("hey i Am Delete baby", id);
        const uid = auth.currentUser.uid;
        console.log("uid==>136", uid);
        await deleteDoc(doc(db, "bk_blogs", id));
        loader.style.display = 'none';
        Swal.fire({
            icon: "success",
            title: "Post Deleted Succesfully",
        });
        getPosts();
    } catch (error) {
        Swal.fire({
            icon: 'Error',
            title: error.message,
        });
    }

}

let getUserInfo = async (uid) => {
    const userRef = doc(db, "hackathon", uid)
    const docSnap = await getDoc(userRef);
    let info = null
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        console.log("renderUserProfile", renderUserProfile);
        info = docSnap.data(
        )
    } else {
        console.log("No such document!");
    }
    return info
}

const logOut = () => {
    signOut(auth)
        .then(() => {
            location.href = "../index.html";
        })
        .catch((error) => {
            console.log("Error while signing out:", error);
        });
}
logOutUser.addEventListener("click", logOut)


window.deletePost = deletePost;
window.editPost = editPost;
UpdateBlogPost.addEventListener('click', upadetPost)
