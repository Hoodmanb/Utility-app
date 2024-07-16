//getting my firebase auth object from initialization file
const authObj = require('../../auth')
const auth = authObj.auth
const app = authObj.app;

//firebase functions
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

//function to set user display name onNew user creation
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

//function to create a new user
const signUp = (req, res) => {

    //destructuring the req body in other to get the form values
    const {
        email,
        password,
        displayName
    } = req.body

    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;
        //set user display name
        await updateUserProfile(user, displayName)

        const userRef = doc(firestore, 'users', user.uid);

        // set initial empty fields for user credentials
        await setDoc(userRef, {
            names: '',
            phone: '',
            gender: '',
            country: ''
        });

        console.log("User document reference created for user:", user.uid);

        message = 'Successful!'
        return res.status(201).send(message)
    })
    .catch((error) => {
        console.log(error.message)
        console.log(error.code)

        //handling error messages
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
        return res.status(400).send(message)
    })
    //res.send(message)
}

module.exports = {
    signUp
}