const authObj = require('../auth')
const auth = authObj.auth;
const app = authObj.app;

const {
    getFirestore,
    doc,
    updateDoc,
    setDoc,
    getDoc,
    collection
} = require('firebase/firestore')


const {
    updateProfile,
    onAuthStateChanged
} = require("firebase/auth");


const firestore = getFirestore(app);
let data;

/*const isRestricted = (req, res, next, user, redirect) => {
    if (user === null) {
        return res.redirect(redirect);
    } else {
        next();
    }
}*/

async function updateUserDetails(res, user, field, value) {
    try {
        if (!user || !user.uid) {
            throw new Error('User object is undefined or does not have a uid property');
        }

        // Log user object for debugging
        //console.log('User object:', user);
        function returnedField(f, v) {
            switch (f) {
                case 'names':
                    return {
                        names: v
                    };
                    case 'gender':
                        return {
                            gender: v
                        };
                        case 'phone':
                            return {
                                phone: v
                            };
                            case 'country':
                                return {
                                    country: v
                                };
                                default:
                                    console.log(`${f} not found okay`);
                                    return null;
                                }
                        }

                        // Create a document reference in Firestore
                        const userRef = doc(firestore, 'users', user.uid);

                        // Use setDoc to create or update the document
                        await setDoc(userRef, {
                            uid: user.uid,
                            ...returnedField(field, value)
                    }, {
                            merge: true
                    });

                console.log('User created and details added to Firestore');
                data = returnedField(field, value)
                res.json(data)
            } catch (error) {
                console.error('Error creating user:', error.message);
            }
        }



        async function updateDisplayName(res, user, newDisplayName) {
            try {
                await updateProfile(user, {
                    displayName: newDisplayName
            });
            console.log("Display name updated successfully!");
            data = {
                displayName: newDisplayName
            }
            return res.json(data)
        } catch (error) {
            console.error("Error updating display name:", error);
        }
    }


    const updateUserData = (req, res, next) => {

        onAuthStateChanged(auth, (user) => {

            //isRestricted(req, res, next, user, 'log-in')
            if (user) {

                let field = JSON.parse(req.body.type);
                let value = req.body.itemToEdit;
                console.log(value);
                //console.log(field)
                if (field === 'displayName') {
                    updateDisplayName(res, user, value)
                } else {
                    updateUserDetails(res, user, field, value)
                }
            } else {
                let authState = 'not a user'

                return res.json({ authState})
        }

            //getProfileData(user.uid)
        })
}


module.exports = {
    updateUserData
}