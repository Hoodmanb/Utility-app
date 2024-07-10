require('dotenv').config();
const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const {
    onAuthStateChanged
} = require("firebase/auth");

// Environment Variables
const port = process.env.PORT || 9090;
const host = process.env.HOST || 'localhost';

// Initialize Express app
const app = express();

//const httpsServer = https.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.set('views', path.join(__dirname, '..', 'views')); // Correct views path
app.set('view engine', 'ejs');

// Firebase Authentication
const authObj = require('./auth');
const auth = authObj.auth;

// Route Handlers
const getRoutes = require('./controller/getRoutes');
const accountDelete = require('./controller/accDelete');
const sendMail = require('./controller/sendmail');
const loginAuth = require('./controller/authentication/loginAuth');
const logoutAuth = require('./controller/authentication/logoutAuth');
const email_PasswordAuth = require('./controller/authentication/email_PasswordAuth');
const userData = require('./models/userData');
const setUserData = require('./models/setUserData');

// Authentication Check Middleware
const authCheck = (req, res, next) => {
    let nextCalled = false;

    onAuthStateChanged(auth, async (user) => {
        if (nextCalled) return;
        nextCalled = true;

        if (user) {
            const profileData = await getRoutes.getProfileData(user) || {};

            console.log('User is logged in:', user.uid);
        } else {

            console.log("User is not logged in");
        }
        next();
    });

    setTimeout(() => {
        if (!nextCalled) {
            nextCalled = true;
            next();
        }
    },
        3000); // Adjust timeout duration as needed
};

app.use(authCheck);

/*const dynamicContent = (req, res) => {
    let message = {
        mess: null
    };
    onAuthStateChanged(auth,
        async (user) => {
            if (user) {
                console.log('displayname :', user.displayName)
                let profileData = await getRoutes.getProfileData(user) || {};
                let {
                    names,
                    gender,
                    phone
                } = profileData;
                let displayName = user.displayName

                const dataToSend = {
                    displayName: displayName,
                    names: names,
                    gender: gender,
                    phone: phone,
                    email: user.email,
                    photoURL: user.photoURL
                };
                res.json(dataToSend)
            } else {
                res.json(message)
            }
        });
}*/



// Route Definitions
app.post("/login", loginAuth.logIn);
app.post("/create", email_PasswordAuth.signUp);
app.post("/updateUserInfo", authCheck, userData.updateUserData);
app.post("/profileSetup", authCheck, multer({
    storage: multer.memoryStorage()
}).single('imageFile'), setUserData.setupProfile);
app.post('/sendmail', sendMail.sendMail);
app.get('/api/logInData', loginAuth.logInDataApi);
app.get('/logout', logoutAuth.logOut);
app.get('/accountDelete', accountDelete.accountDelete);
app.get('/api/Data', email_PasswordAuth.signUpDataApi);


// Sample data endpoint
//app.get('/api/dynamic-data', dynamicContent)


// Sample data endpoint
/*app.get('/api/dynamic-data', (req, res) => {
    const names = 'Nwigiri'
    res.send(names);
});*/


app.get('/', getRoutes.landingPage);
app.get("/sign-up", getRoutes.signUp);
app.get("/setprofile", getRoutes.profileSetup);
app.get("/log-in", getRoutes.logIn);
app.get("/partials", getRoutes.partials);
app.get("/partials/profile", getRoutes.partials_profile);
app.get("/partials/home", getRoutes.partials_home);
app.get("/data", getRoutes.data);
app.get("/airtime", getRoutes.airtime);
app.get("/dashboard", getRoutes.dashboard);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:',
        err.stack);
    console.error('Message:',
        err.message);
    next();
});

app.use((req, res, next) => {
    return res.status(404).render('404');
});

// Start the server
/*httpsServer.listen(port, () => {
console.log(`Access Server On https://${host}:${port}`);
});*/

app.listen(port, () => {
    console.log(`Access Server On http://${host}:${port}`);
});