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
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

const fileInput = document.querySelectorAll("#file-input")[0];
const userProfile = document.querySelectorAll("#user-profile")[0];
const updateProfileBtn = document.querySelectorAll(".update-profile")[0];
let loader = document.querySelectorAll("#loader")[0];
const name = document.querySelectorAll("#name")[0];
const userName = document.querySelectorAll("#username")[0];
const email = document.querySelectorAll("#email")[0];
const oldPassword = document.querySelectorAll("#old-password")[0];
const newPassword = document.querySelectorAll("#new-password")[0];
const confirmPassword = document.querySelectorAll("#confirm-password")[0];
const cameraImg = document.querySelectorAll("#camera-img")[0];
const editInfo = document.querySelectorAll("#edit-feild")[0];
const saveInfo = document.querySelectorAll("#save-feild")[0];
const savePassFeild = document.querySelectorAll("#save-feild-pass")[0];
const editPassFeild = document.querySelectorAll("#edit-feild-pass")[0];
const oldPassBox = document.querySelectorAll(".old-pass-sty")[0];



onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("uid==>", uid);
    // console.log("location==>", location.href);
    getUserInfo()
  } else {
    console.log("user sign out");

  }
});


/// -------------------geeting User data into FireStore FireBase ----------------------------///
let getUserInfo = async (uid) => {

  loader.style.display = 'block';
  const q = query(collection(db, "hackathon"))
  // , where("uid", "==", auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    name.value = doc.data().name;
    userName.value = doc.data().userName;
    email.value = doc.data().email;
    if (doc.data().userProfileImgUrl) {
      userProfile.src = doc.data().userProfileImgUrl;
      console.log("userprofile",userProfile);
    }

    console.log(" doc.data()==>", doc.data());
  });

  loader.style.display = 'none';
  cameraImg.style.backgroundColor = '#f1ecec'

}

// ---------   This Function Change the user image and convert into a url ------------------------//
fileInput.addEventListener('change', (e) => {
  userProfile.src = URL.createObjectURL(e.target.files[0]);
  cameraImg.style.backgroundColor = '#f1ecec'
})

// ---------   Upadte Profile Code Here with delete existing image add new image------------------------//

// Define a flag to track if it's the first update
// let isFirstUpdate = true;
// const updateProfile = async () => {
//   try {
//     loader.style.display = 'block';
//     console.log("update baby");
//     const file = fileInput.files[0];

//     if (file) {
//       const user = auth.currentUser;
//       if (user) {
//         const uid = user.uid;
//         const userRef = doc(db, "hackathon", uid);

//         const userDocSnapshot = await getDoc(userRef);
//         const userData = userDocSnapshot.data();
//         const oldProfileImageUrl = userData.profileImageUrl;

//         let userProfileImgUrl = await uploadFile(file);
//         console.log("userprofile==>", userProfileImgUrl);

//         // If there was a previous profile image and it's not the first update, delete it
//         if (oldProfileImageUrl && !isFirstUpdate) {
//           const oldImageRef = ref(storage, `testImg/${oldProfileImageUrl}`);

//           // Delete the old image
//           await deleteObject(oldImageRef);
//         }

//         // Update the user's document with the new profileImageUrl
//         await updateDoc(userRef, {
//           profileImageUrl: userProfileImgUrl,
//           name, // Make sure 'name' is defined or replace it with the actual name value
//         });

//         Swal.fire({
//           icon: "success",
//           title: "User Profile Updated 😊",
//         });

//         // Set the flag to false after the first update
//         isFirstUpdate = false;
//       }
//     }

//   } catch (error) {
//     Swal.fire({
//       icon: "error",
//       title: "Oops...",
//       text: error,
//       footer: '<a href="">Why do I have this issue?</a>',
//     });
//     console.log("error==>143", error);
//   }

//   loader.style.display = 'none';
// };
// loader.style.display = 'block';
// console.log(name.value);
// console.log(userName.value);
// name.value = "";
// userName.value = ""; 
// const uid = auth.currentUser.uid;
// const userFeildChangeRef = doc(db, "hackathon", uid);
// await updateDoc(userFeildChangeRef, {
//   name: name.value,
//   userName: userName.value,
// });
// loader.style.display = 'none';
// Swal.fire(
//   'Profile!',
//   'profile updated!😊',
//   'success'
// )
const editUserFeild = async () => {
  name.value = "";
  userName.value = "";
  editInfo.style.display = 'none';
  saveInfo.style.display = "block";

}
const saveUserInfo = async () => {
  const updatedName = name.value;
  const updatedUserName = userName.value;
  if (updatedName && updatedUserName) {
    loader.style.display = 'block';

    const uid = auth.currentUser.uid;
    const userFeildChangeRef = doc(db, 'hackathon', uid);

    await updateDoc(userFeildChangeRef, {
      name: updatedName,
      userName: updatedUserName,
    });

    loader.style.display = 'none';

    Swal.fire('Profile Updated!', 'Name And UserName Updated! 😊', 'success');

    // Hide the "Save" button and show the edit icon
    saveInfo.disabled = true;
    editInfo.style.display = 'none';
    saveInfo.style.display = "block";

  } else {
    Swal.fire('Error', 'Name and username cannot be empty!', 'error');
  }

}
editInfo.addEventListener('click', editUserFeild)
saveInfo.addEventListener("click", saveUserInfo)

// let userImage = {}
const updateProfile = async () => {
  loader.style.display = 'block';
  if (oldPassword.value && newPassword.value) {
    await editPassWord(oldPassword.value, newPassword.value)
  }
  let userImage = {}
  let file = fileInput.files[0];
  if (fileInput.files[0]) {
    userImage.userProfileImgUrl = await uploadFile(file);
  }
 
  const uid = auth.currentUser.uid;
  const userRef = doc(db, "hackathon", uid);
  await updateDoc(userRef, userImage);
  console.log("userImage230",userImage);

  loader.style.display = 'none';
  oldPassword.value = ""
  newPassword.value = ""
  Swal.fire(
    'Profile!',
    'profile updated!😊',
    'success'
  )
}

// ------------------- This Function Work Is edit feild for Password  ----------------------------//
const editPassWord = (oldPass, newPass,confirmPas) => {
  loader.style.display = 'block';
  // Enable the input fields for editing
  oldPassword.disabled = false;
  newPassword.disabled = false;
  confirmPassword.disabled = false;
  updateProfileBtn.disabled = true;
 

  editPassFeild.style.display = 'none';
  savePassFeild.style.display = "block";
  return new Promise((resolve, reject) => {
    const currentUser = auth.currentUser;
    console.log("currentUser==>", currentUser);
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      oldPass
    );
    reauthenticateWithCredential(currentUser, credential)
      .then((res) => {
        updatePassword(currentUser, newPass,confirmPas).then(() => {
          resolve(res)
        }).catch((error) => {
          reject(error)
        });
      })
      .catch((error) => {
      });
    loader.style.display = 'none';
  })
}

//----------------------- ``````````` User New Password Set Logic `````````````````````````````````````-----------//
const savePassword = async () => {
  try {
    loader.style.display = 'block';
    updateProfileBtn.disabled = true;

    if (oldPassword.value && newPassword.value && confirmPassword.value) {
      await editPassWord(oldPassword.value, newPassword.value,confirmPassword.value);
      Swal.fire('Password Updated!', 'Your password has been updated! 😊', 'success');
    } else {
      Swal.fire('Error', 'Please fill out both old and new password fields.', 'error');
    }
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    savePassFeild.disabled = true;
    editPassFeild.style.display = 'none';
    savePassFeild.style.display = 'block';
    loader.style.display = 'none';
  } catch (error) {
    Swal.fire('Error', 'An error occurred while updating your password.', 'error');
    console.error('Error updating password:', error);
    loader.style.display = 'none';
  }
};


editPassFeild.addEventListener('click', editPassWord)
savePassFeild.addEventListener('click', savePassword)







// ------------- This Function Work Only Uploading A File Object img,video,pdf etc...   -----------------//
const uploadFile = (file) => {
  loader.style.display = 'block';

  return new Promise((resolve, reject) => {
    const userProfileRef = ref(storage, `images/${file.name}`);
    console.log("userProfileRef", userProfileRef);
    const uploadTask = uploadBytesResumable(userProfileRef, file);
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
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: reject.error,
          footer: '<a href="">Why do I have this issue?</a>',
        });
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
          console.log("File available at", downloadURL);
        });
      }
    );
  });
  loader.style.display = 'none';

};






updateProfileBtn.addEventListener("click", updateProfile);


















// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     getDownloadURL(ref(storage, user.uid))
//       .then((url) => {
//         img.setAttribute("src", url);
//       })
//       .catch((error) => {
//       });
//     const uid = user.uid;
//     console.log("uid==>", uid);
//     console.log("location==>", location.href);
//     getUserCurrentData(uid);
//   } else {
//     console.log("user sign out");

//   }
// });

// const getUserCurrentData = async (uid) => {
//   loader.style.display = 'block';
//   const q = query(collection(db, "hackathon"), where("uid", "==", uid));
//   const querySnapshot = await getDocs(q);
//   querySnapshot.forEach((doc) => {
//     console.log(doc.id, " => ", doc.data());
//     const email = document.querySelectorAll("#email")[0];
//     const name = document.querySelectorAll("#name")[0];
//     const userName = document.querySelectorAll("#username")[0];
//     const userImg = document.querySelectorAll("#user-profile")[0];

//     name.value = doc.data().name;
//     userName.value = doc.data().userName;
//     userImg.value = doc.data().profileImageUrl;
//     email.value = doc.data().email;
//       loader.style.display = 'none';

//   });

// };


// let updateprofile = async () => {
//     try {
//       const name = document.querySelectorAll("#name")[0].value;
//       const userName = document.querySelectorAll("#username")[0].value;
//       const email = document.querySelectorAll("#email")[0].value;
//       const oldPassword = document.querySelectorAll("#old-password")[0].value;
//       const newPassword = document.querySelectorAll("#new-password")[0].value;
//       const confirmPassword = document.querySelectorAll("#confirm-password")[0].value;
//       const file = fileInputBtn.files[0];
//       const imageUrl = await uploadFile(file);
//       console.log(name,userName,email,oldPassword,newPassword,confirmPassword);
//       const uid = auth.currentUser.uid;
//       const userRef = doc(db, "hackathon", uid);

//       // Update Firestore document with image URL
//       await updateDoc(userRef, {
//         profileImageUrl: imageUrl,
//         // name,
//       });

//       const storageRef = ref(storage, uid);

//       uploadBytes(storageRef, file)
//         .then((snapshot) => {
//           console.log("Uploaded a blob or file!");
//         })
//         .then(async () => {
//           getDownloadURL(ref(storage, uid))
//             .then((url) => {
//               const img = document.getElementById("user-profile");
//               img.setAttribute("src", url);
//             })
//             .catch((error) => {
//             });

//           // Save the image URL in localStorage
//           // localStorage.setItem("profileImageUrl", imageUrl);

//           Swal.fire({
//             icon: "success",
//             title: "User updated successfully",
//           });
//         });
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Something went wrong!",
//         footer: '<a href="">Why do I have this issue?</a>',
//       });
//       console.log("error", error);
//     }
//   };

//   //---------------- Check if the URL is saved in localStorage   ---------------//
//   // const savedImageUrl = localStorage.getItem("profileImageUrl");

//   // if (savedImageUrl) {
//   //   const img = document.getElementById("user-profile");
//   //   img.setAttribute("src", savedImageUrl);
//   // }

//   updateProfileBtn.addEventListener("click", updateprofile);
//   // Rest of your existing code...

// // ---------------------- This File Work Is uploading a file    ---------------------//

// // update Profile //

// fileInputBtn.addEventListener("change", () => {
//   console.log(fileInputBtn.files[0]);
//   userProfile.src = URL.createObjectURL(fileInputBtn.files[0]);
// });

// //----------------------  This Function for logout Current User --------------------///
// const uploadFile = (file) => {
//   return new Promise((resolve, reject) => {
//     const mountainImagesRef = ref(storage, `images/${file.name}`);
//     const uploadTask = uploadBytesResumable(mountainImagesRef, file);
//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
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
//           console.log("File available at", downloadURL);
//         });
//       }
//     );
//   });
// };

const logoutBtn = document.querySelectorAll("#logout-btn")[0];
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      location.href = "../index.html";
    })
    .catch((error) => {
      console.log("Error while signing out:", error);
    });
});
