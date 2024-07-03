const authObj = require('../auth');
const auth = authObj.auth;
const app = authObj.app;

const {
    doc,
    getFirestore,
    deleteDoc
} = require('firebase/firestore');

const {
    onAuthStateChanged
} = require("firebase/auth");

const firestore = getFirestore(app);

const accountDelete = (req, res) => {
    const user = auth.currentUser;
    if (user) {

        user.delete()
        .then(() => {
            // User deleted successfully
            console.log("User deleted");

            const userDocRef = doc(firestore, "users", user.uid); // Use a different variable name
            deleteDoc(userDocRef)
            .then(() => {
                console.log("User data deleted");
                return res.status(204).send(); // Send response after successful deletion
            })
            .catch((error) => {
                console.error("Error deleting user data:", error);
                return res.status(500).send("Error deleting user data"); // Handle error response
            });
        })
        .catch((error) => {
            // Handle errors deleting the user
            console.error("Error deleting user:", error);
            return res.status(500).send("Error deleting user");
        });
    } else {
        console.error("No authenticated user to delete.");
        return res.status(401).send("No authenticated user to delete");
    }
};

module.exports = {
    accountDelete
};