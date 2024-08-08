const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const multer = require('multer')
const bodyParser = require('body-parser');

const expApp = express();

const authObj = require('./auth')
const auth = authObj.auth

const {
    onAuthStateChanged
} = require("firebase/auth");

const getRoutes = require('./controller/getRoutes');
const accountDelete = require('./controller/accDelete');
const sendMail = require('./controller/sendmail');
const loginAuth = require('./controller/authentication/loginAuth');
const logoutAuth = require('./controller/authentication/logoutAuth');
const email_PasswordAuth = require('./controller/authentication/email_PasswordAuth');
const userData = require('./models/userData');
const setUserData = require('./models/setUserData');

const port = 1111;
const host = '127.0.0.1';

// Middlewares
expApp.use(cors());
expApp.use(express.json());
expApp.use(express.urlencoded({
    extended: true
}));
expApp.use(express.static(path.join(__dirname, '../')));

expApp.set('views', path.join(__dirname, '../views')); // Correct views path
expApp.set('view engine', 'ejs');

expApp.use(bodyParser.urlencoded({
    extended: true
}));

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});

expApp.use(session({
    secret: 'ijsjjjsjjsjksjdofmklfmkkejkekmekkkfmklmdll',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 9999999999999,
        SameSite: 'strict'
    }
}));

// WebSocket setup
const WebSocket = require('ws');
/*const wss = new WebSocket.Server({
    server: expApp
});*/

const wss = new WebSocket.Server({
    port: 9090
});


const setupWebSocket = (wss, user) => {
    wss.on('connection', async (ws) => {
        if (!user) {
            let dataToSend = {
                message: 'user not logged in'
            };
            ws.send(JSON.stringify(dataToSend));
        } else {
            try {
                let profileData = await getRoutes.getProfileData(user) || {};
                let {
                    names,
                    gender,
                    phone
                } = profileData;
                
                console.log('profileData :', profileData)

                let dataToSend = {
                    displayName: user.displayName,
                    names: names,
                    gender: gender,
                    phone: phone,
                    email: user.email,
                    photoURL: user.photoURL
                };
                
                console.log('dataToSend :', dataToSend)
                ws.send(JSON.stringify(dataToSend));
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        }
    });
};
const user = auth.currentUser
// Call this function once to set up the WebSocket server
setupWebSocket(wss, user);

// Middleware to clear session
expApp.use((req, res, next) => {
    req.session.user = null;
    req.session.name = null;
    req.session.email = null;
    req.session.userId = null;
    next();
});

const authCheck = (req, res, next) => {
    let nextCalled = false;

    onAuthStateChanged(auth,
        async (user) => {
            if (nextCalled) return;
            nextCalled = true;

            if (user) {
                const name = user.displayName;
                const email = user.email;
                const userId = user.uid;

                req.session.userId = userId;
                req.session.name = name;
                req.session.user = user;
                req.session.email = email;

                const profileData = await getRoutes.getProfileData(user) || {};
                const {
                    names,
                    gender,
                    phone
                } = profileData;

                req.session.names = names ? names: null;
                req.session.gender = gender ? gender: null;
                req.session.phone = phone ? phone: null;
            } else {
                req.session.userId = null;
                req.session.name = null;
                req.session.user = null;
                req.session.email = null;
            }
            next();
        });

    setTimeout(() => {
        if (!nextCalled) {
            nextCalled = true;
            next();
        }
    },
        3000);
};

const restricted = (req, res, next) => {
    onAuthStateChanged(auth,
        (user) => {
            if (!user) {
                res.status(401).redirect('/log-in');
            } else {
                next();
            }
        });
};

// Routes
expApp.use(authCheck);

expApp.get('/favicon.ico', (req, res) => res.status(204));

expApp.post("/login", loginAuth.logIn);
expApp.post("/create", email_PasswordAuth.signUp);
expApp.post("/updateUserInfo", restricted, userData.updateUserData);
expApp.post("/profileSetup", restricted, upload.single('imageFile'), setUserData.setupProfile);
expApp.post('/sendmail', sendMail.sendMail);

expApp.get('/api/logInData', loginAuth.logInDataApi);
expApp.get('/logout', logoutAuth.logOut);
expApp.get('/accountDelete', accountDelete.accountDelete);
expApp.get('/api/Data', email_PasswordAuth.signUpDataApi);

expApp.get('/', getRoutes.landingPage);
expApp.get("/sign-up", getRoutes.signUp);
expApp.get("/setprofile", getRoutes.profileSetup);
expApp.get("/log-in", getRoutes.logIn);
expApp.get("/partials", getRoutes.partials);
expApp.get("/partials/profile", getRoutes.partials_profile);
expApp.get("/partials/home", getRoutes.partials_home);
expApp.get("/data", getRoutes.data);
expApp.get("/airtime", getRoutes.airtime);
expApp.get("/dashboard", getRoutes.dashboard);

// 404 handler
expApp.use((req, res, next) => {
    res.status(404).render('404');
});

// Error handler
expApp.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
expApp.listen(port, () => {
    console.log(`Access Server On http://localhost:${port}`);
});