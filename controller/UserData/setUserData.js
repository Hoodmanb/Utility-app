const authObj = require('../../auth');
const auth = authObj.auth;
const app = authObj.app;

const {
    getFirestore,
    doc,
    setDoc
} = require('firebase/firestore');

const {
  updateProfile
} = require("firebase/auth");

const {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} = require('firebase/storage');

const storage = getStorage(app);
const firestore = getFirestore(app);

async function setupProfile(req, res) {
    const {
        names,
        number,
        country,
        gender
    } = req.body;

    const user = auth.currentUser;

    if (req.file) {
        
        const buffer = req.file.buffer;
        
        const storageRef = ref(storage, 'user_photos/' + user.uid + '/profile-pics');
        const uploadTask = uploadBytesResumable(storageRef, buffer);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.error('Upload failed:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    // Example: Update user profile with photo URL
                    updateProfile(user, {
                        photoURL: downloadURL
                    }).then(() => {
                        console.log('User profile updated with photo URL');
                    }).catch((error) => {
                        console.error('Error updating user profile:', error);
                    });
                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                });
            }
        );

    } else {
        console.log('No file received');
    }
    if (!user || !user.uid) {
        console.log('error: Unauthorized. User not found or not authenticated')
        return res.status(401).json({
            error: 'Unauthorized. User not found or not authenticated.'
        });
    }

    if (!names || !number || !country || !gender) {
        console.log('error:  Missing required fields')
        return res.status(400).json({
            error: 'Missing required fields'
        });
    }

    try {
        const userRef = doc(firestore, 'users', user.uid);

        await setDoc(userRef, {
            uid: user.uid,
            names: names || null,
            phone: number || null,
            country: country || null,
            gender: gender || null
        }, {
            merge: true
        });

        console.log('User created and details added to Firestore');
        return res.status(200).json({
            message: 'Successful'
        });
    } catch (error) {
        console.error('Error creating user:', error.message);
        //return res.status(500).json({
        //   error: 'Internal Server Error'
        //});
    }
}

module.exports = {
    setupProfile
};