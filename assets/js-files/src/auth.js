const {
  initializeApp
} = require("firebase/app");

const {
  getDoc,
  getFirestore,
  collection,
  doc,
  addDoc
} = require("firebase/firestore");

const {
  getAuth,
  onAuthStateChanged
} = require("firebase/auth");


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

//auth.useDeviceLanguage();
//let db = getFirestore(app);

module.exports = { auth };