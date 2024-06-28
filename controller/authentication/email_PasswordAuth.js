const authObj = require('../../auth')
const auth = authObj.auth
const app = authObj.app;
const {
  createUserWithEmailAndPassword,
  updateProfile
} = require("firebase/auth");

const {
  getFirestore,
  doc,
  setDoc,
} = require('firebase/firestore')

const firestore = getFirestore(app);

async function updateUserProfile(user, newDisplayName) {
  try {
    await updateProfile(user, {
      displayName: newDisplayName
    });
    console.log("Display name updated successfully!");
  } catch (error) {
    console.error("Error updating display name:", error);
  }
}
let message = '';

const signUp = (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  const displayName = req.body.displayName;

  createUserWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    const user = userCredential.user;
    const userId = user.uid;
    
    await updateUserProfile(user, displayName)
    
    
    const userRef = doc(firestore, 'users', user.uid);

    // Optionally, you can set initial empty fields or default values
    await setDoc(userRef, {
      names: '',
      gender: '',
      phone: ''
    });

    console.log("User document reference created for user:", user.uid);

    message = 'Successful!'
    res.status(201).json({msg:'success'})
    console.log(user)
    return
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('error')
    console.log(error.message)
    console.log(error.code)

    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Invalid email';
        break;
      case 'auth/user-disabled':
        message = 'User disabled';
        break;
      case 'auth/wrong-password':
        message = 'Wrong password';
        break
      case 'auth/email-already-in-use':
        message = 'Email already in use Please login';
        break;
      case 'auth/weak-password':
        message = 'password to weak';
        break;
      default:
        message = error.code || 'Server error, please try again';
        break;
    }
    console.log(message)
    res.status(500).json({msg:message})
    return
  })
  //res.send(message)
}

const signUpDataApi = (req, res) => {
  return res.json({
    message: message
  });
}

module.exports = {
  signUp,
  signUpDataApi
}



/*console.log('John', user.displayName)
    const name = user.displayName;
    //const email = user.email;
    req.session.name = name;*/