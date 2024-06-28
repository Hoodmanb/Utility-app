require('dotenv').config();

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
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

auth.useDeviceLanguage();
//let db = getFirestore(app);

module.exports = { auth, app };