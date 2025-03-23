// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcYbnQQ09TN2SUnn9JXiAfNWrqq429W8I",
    authDomain: "drishyam-22d26.firebaseapp.com",
    projectId: "drishyam-22d26",
    storageBucket: "drishyam-22d26.firebasestorage.app",
    messagingSenderId: "422148821389",
    appId: "1:422148821389:web:0d4bdfab42c8fe46d56dc4",
    measurementId: "G-B58S0WHPJT"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  // Dark Mode Toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
  });
  
  // Google Login
  function googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).then(result => {
          document.getElementById("profile-username").innerText = result.user.displayName;
          document.getElementById("profile-pic").src = result.user.photoURL;
      }).catch(error => console.log(error.message));
  }
  
  // Logout
  function logout() {
      auth.signOut().then(() => {
          document.getElementById("profile-username").innerText = "";
          document.getElementById("profile-pic").src = "";
      });
  }
  
  // Upload Story
  function uploadStory() {
      const file = document.getElementById("storyUpload").files[0];
      const storageRef = storage.ref("stories/" + file.name);
      storageRef.put(file).then(() => {
          alert("Story uploaded!");
      });
  }
  
  // Upload Post
  function uploadImage() {
      const file = document.getElementById("fileUpload").files[0];
      const caption = document.getElementById("caption").value;
      const storageRef = storage.ref("posts/" + file.name);
      storageRef.put(file).then(snapshot => {
          snapshot.ref.getDownloadURL().then(url => {
              db.collection("posts").add({ imageUrl: url, caption: caption });
              alert("Post uploaded!");
          });
      });
  }
  
  // Load Feed
  function loadFeed() {
      db.collection("posts").onSnapshot(snapshot => {
          const feed = document.getElementById("feed");
          feed.innerHTML = "";
          snapshot.forEach(doc => {
              const post = doc.data();
              feed.innerHTML += `<div class='post'><img src='${post.imageUrl}'><p>${post.caption}</p></div>`;
          });
      });
  }
  
  document.addEventListener("DOMContentLoaded", loadFeed);
  
  // Chat Functionality
  function sendMessage() {
      const message = document.getElementById("chatMessage").value;
      db.collection("chat").add({ text: message, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
  }
  
  db.collection("chat").orderBy("timestamp").onSnapshot(snapshot => {
      const chatBox = document.getElementById("chat-box");
      chatBox.innerHTML = "";
      snapshot.forEach(doc => {
          chatBox.innerHTML += `<p>${doc.data().text}</p>`;
      });
  });
  
