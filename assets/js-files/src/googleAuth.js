import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9uj60MMA8UXdHVJTaOJFIGllbS267Kvc",
  authDomain: "bill-payment-52e57.firebaseapp.com",
  projectId: "bill-payment-52e57",
  storageBucket: "bill-payment-52e57.appspot.com",
  messagingSenderId: "737516881413",
  appId: "1:737516881413:web:5f1fc8129c653b8484be6c",
  measurementId: "G-7YW08XKPHP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Frontend code
const sendDataToBackend = async (data) => {

  const user = {
    id: data.uid,
    email: data.email,
    displayName: data.displayName,
    // Include other relevant user properties here
  };

  try {
    const response = await fetch('/api/googleAuth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      console.log('Data sent successfully!');
    } else {
      console.error('Failed to send data to the backend');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};







function googleSignUp() {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider)
  .then((result) => {
    // User signed in successfully
    const user = result.user;
    console.log("Signed in as:", user.displayName);
    console.log(user);
    console.log(user.email);
    console.log(user.displayName)
    console.log(user.name)
    // You can redirect to another page or perform other actions here

    sendDataToBackend(user);

    window.location.href = '/airtime';

  })
  .catch((error) => {
    // Handle errors
    console.error("Google sign-in failed:", error);
  });
}



//googleButton.addEventListener('click', googleSignUp)

window.addEventListener('DOMContentLoaded', () => {
  const googleButton = document.getElementById('googleauth');
  googleButton.addEventListener('click', googleSignUp);
});