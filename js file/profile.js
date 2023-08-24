import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKckeGedMbGSj7NpxFk3siDAXkzd-yGU0",
  authDomain: "friend-hackthon.firebaseapp.com",
  projectId: "friend-hackthon",
  storageBucket: "friend-hackthon.appspot.com",
  messagingSenderId: "229955689782",
  appId: "1:229955689782:web:29c41164559f544a626797",
  measurementId: "G-ZST5B4N4VQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

const fileInputBtn = document.querySelectorAll("#file-input")[0];
const userProfile = document.querySelectorAll("#user-profile")[0];
const updateProfileBtn = document.querySelectorAll("#update-profile")[0];

onAuthStateChanged(auth, (user) => {
  if (user) {
    getDownloadURL(ref(storage, user.uid))
      .then((url) => {
        const img = document.getElementById("user-profile");
        img.setAttribute("src", url);
      })
      .catch((error) => {
      });

    const uid = user.uid;
    console.log("uid==>", uid);
    console.log("location==>", location.href);
    getUserCurrentData(uid, user.email);
    document.getElementById("email").value = user.email;
    // ...
  } else {
    console.log("user sign out");

  }
});

const getUserCurrentData = async (uid, email) => {
  //   console.log("email==>",email)

  const q = query(collection(db, "hackathon"), where("email", "==", email));
  // console.log("q==>",q);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    document.getElementById("name").value = doc.data().name;
    document.getElementById("userName").value = doc.data().userName;
  });
};


let updateprofile = async () => {
    try {
      const name = document.querySelectorAll("#name")[0].value;
      const email = document.querySelectorAll("#email")[0].value;
      const file = fileInputBtn.files[0];
      const imageUrl = await uploadFile(file);
  
      const uid = auth.currentUser.uid;
      const userRef = doc(db, "hackathon", uid);
  
      // Update Firestore document with image URL
      await updateDoc(userRef, {
        profileImageUrl: imageUrl,
        // name,
      });
  
      const storageRef = ref(storage, uid);
  
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
        })
        .then(async () => {
          getDownloadURL(ref(storage, uid))
            .then((url) => {
              const img = document.getElementById("user-profile");
              img.setAttribute("src", url);
            })
            .catch((error) => {
            });
  
          // Save the image URL in localStorage
          localStorage.setItem("profileImageUrl", imageUrl);
  
          Swal.fire({
            icon: "success",
            title: "User updated successfully",
          });
        });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="">Why do I have this issue?</a>',
      });
      console.log("error", error);
    }
  };
  
  //---------------- Check if the URL is saved in localStorage   ---------------//
  const savedImageUrl = localStorage.getItem("profileImageUrl");
  
  if (savedImageUrl) {
    const img = document.getElementById("user-profile");
    img.setAttribute("src", savedImageUrl);
  }
  
  updateProfileBtn.addEventListener("click", updateprofile);
  // Rest of your existing code...
  
// ---------------------- This File Work Is uploading a file    ---------------------//

// update Profile //

fileInputBtn.addEventListener("change", () => {
  console.log(fileInputBtn.files[0]);
  userProfile.src = URL.createObjectURL(fileInputBtn.files[0]);
});

// const uploadFile = (file) => {
//   return new Promise((resolve, reject) => {
//     const mountainImagesRef = ref(storage, `images/${file.files.name}`);
//     const uploadTask = uploadBytesResumable(mountainImagesRef, file.files[0]);
//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         // Observe state change events such as progress, pause, and resume
//         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log("Upload is " + progress + "% done");
//         switch (snapshot.state) {
//           case "paused":
//             console.log("Upload is paused");
//             break;
//           case "running":
//             console.log("Upload is running");
//             break;
//         }
//       },
//       (error) => {
//         reject(error);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           resolve(downloadURL);
//         });
//       }
//     );
//   });
// };

//----------------------  This Function for logout Current User --------------------///
const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const mountainImagesRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(mountainImagesRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        // Upload is complete, resolve with the download URL
        // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //   resolve(downloadURL);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
          console.log("File available at", downloadURL);
        });
      }
    );
  });
};

const logoutBtn = document.querySelectorAll("#logout-btn")[0];
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      // let indexProfile = document.querySelectorAll("#index-profile")[0];
      // indexProfile.style.display = "none";
      location.href = "../index.html";
    })
    .catch((error) => {
      // An error happened.
      console.log("Error while signing out:", error);
    });
});
