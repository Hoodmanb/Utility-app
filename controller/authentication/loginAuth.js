const authObj = require('../../auth')
const auth = authObj.auth
const {
  signInWithEmailAndPassword
} = require("firebase/auth");

let message = null;
let user = null;
let logInMessage = null;


const logIn = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      logInMessage = 'Sucessful!'
      user = userCredential.user;
      userId = user.uid;

      res.redirect('/');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage)
      user = null;

      switch (error.code) {
        case 'auth/invalid-email':
          logInMessage = 'Invalid email';
          break;
        case 'auth/user-disabled':
          logInMessage = 'User disabled';
          break;
        case 'auth/wrong-password':
          logInMessage = 'Wrong password';
          break;
        case 'auth/email-already-in-use':
          logInMessage = 'Email already in use Please login';
          break;
        case 'auth/weak-password':
          logInMessage = 'password to weak';
          break;
        case 'auth/invalid-credential':
          logInMessage = 'invalid-credential';
          break;
        default:
          logInMessage = 'Server error, please try again';
          break;
      }

    })

}

const logInDataApi = (req, res) => {
  res.json({
    logInMessage
  });
}

module.exports = {
  logIn,
  logInDataApi
};