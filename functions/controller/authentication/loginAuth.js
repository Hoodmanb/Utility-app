//getting firebase auth object
const authObj = require('../../auth')
const auth = authObj.auth

//firebase functions
const {
    signInWithEmailAndPassword
} = require("firebase/auth");


//function to authenticate user
const logIn = (req, res) => {
    //destructuer req body
    const {
        email,
        password
    } = req.body

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user
        userId = user.uid;
        console.log(userId)

        return res.send('Successful!')

    })
    .catch((error) => {
        let errorCode = error.code
        console.log('Error code: ', errorCode)

        let message;
        //firebase error code to send to frontend
        switch (errorCode) {
            case 'auth/invalid-email':
                message = 'Invalid email';
                break;
            case 'auth/user-disabled':
                message = 'User disabled';
                break;
            case 'auth/wrong-password':
                message = 'Wrong password';
                break;
            case 'auth/email-already-in-use':
                message = 'Email already in use Please login';
                break;
            case 'auth/weak-password':
                message = 'password to weak';
                break;
            case 'auth/invalid-credential':
                message = 'invalid-credential';
                break;
            default:
                message = 'Server error, please try again';
                break;
        }
        return res.send(message)

    })
}

module.exports = {
    logIn
};