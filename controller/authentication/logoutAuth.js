const authObj = require('../../auth')
const auth = authObj.auth
const {
  createUserWithEmailAndPassword,
  signOut
} = require("firebase/auth");

//let user = null;

const logOut = (req, res) => {
  signOut(auth)
  .then(() => {

    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
        //res.clearCookie('yourCookieName');
        console.log('successfully cleared session')
      }
    });

    // Redirect to login page upon successful logout
    console.log('user logged out')

    console.log(req.session)


    res.redirect("/log-in");
  })
  .catch((error) => {
    console.error("Logout error:",
      error.message);
  });
}

module.exports = {
  logOut
}