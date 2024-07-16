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
        // Redirect to login page upon successful logout
        console.log('user logged out')

        return res.redirect("/log-in");
    })
    .catch((error) => {
        console.error("Logout error:",
            error.message);
            return res.status(500).render('500')
    });
}

module.exports = {
    logOut
}