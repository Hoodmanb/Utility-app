const express = require('express');
const session = require('express-session');

const cors = require('cors');

const expApp = express();


const authObj = require('./auth')
const auth = authObj.auth

const {
    onAuthStateChanged
} = require("firebase/auth");


const getRoutes = require('./controller/getRoutes')

const accountDelete = require('./controller/accDelete')

const sendMail = require('./controller/sendmail')

const loginAuth = require('./controller/authentication/loginAuth');

const logoutAuth = require('./controller/authentication/logoutAuth')

const email_PasswordAuth = require('./controller/authentication/email_PasswordAuth')

const userData = require('./controller/userData/userData')

const setUserData = require('./controller/userData/setUserData')


const port = 7050;
const host = '127.0.0.1';

expApp.use(cors());
expApp.use(express.json());
expApp.use("/assets", express.static("assets"));

const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 2222
});

const multer = require('multer')
const bodyParser = require('body-parser');

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
        // SameSite: 'strict' // Uncomment this line for better security
    }
}));

expApp.use((req, res, next) => {
    let user = req.session.user

    setupWebSocket(wss, user)

    req.session.user = null;
    req.session.name = null;
    req.session.email = null;
    req.session.userId = null;



    next()
})

var userID = null
//var user = null
//const profileData = getRoutes.getProfileData(user) || {};

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

                userID = user.uid
                //user = user
                //webSocketData(user)

                req.session.userId = userId
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
                req.session.phone = phone? phone: null;

                console.log(names, gender, phone)

                console.log('user is logged in');
                console.log(user.uid);
            } else {
                //user = null
                userID = null

                req.session.userId = null
                req.session.name = null
                req.session.user = null
                req.session.email = null
                console.log("User is not logged in");
            }
            next();
        });


    // Ensure next is called in case onAuthStateChanged does not invoke its callback
    setTimeout(() => {
        if (!nextCalled) {
            nextCalled = true;
            next();
        }
    },
        3000); // Adjust timeout duration as needed
};


const setupWebSocket = (wss, user) => {
    wss.on('connection',
        async (ws) => {
            // Fetch user information in connection event
            //let user = getUser(); // Assume getUser is a function that gets the user info

            if (!user) {
                let dataToSend = {
                    message: 'user not logged in'
                };
                ws.send(JSON.stringify(dataToSend));
                console.log('sent but not logged in');
            } else {
                try {
                    let profileData = await getRoutes.getProfileData(user) || {};
                    let {
                        names,
                        gender,
                        phone
                    } = profileData;

                    let dataToSend = {
                        displayName: user.displayName,
                        names: names,
                        gender: gender,
                        phone: phone,
                        email: user.email,
                        photoURL: user.photoURL
                    };

                    ws.send(JSON.stringify(dataToSend));
                    console.log('Client connected and data sent.', user.uid);

                    // Handle client closing connection
                    ws.on('close', function() {
                        console.log('Client disconnected.');
                    });

                } catch (error) {
                    console.error('Error fetching profile data:', error);
                }
            }
        });

    console.log('WebSocket setup complete.');
};

// Call this function once to set up the WebSocket server
setupWebSocket(wss);

//webSocketData(user)
//expApp.use(webSocketData)



const restricted = (req, res, next) => {
    let user = req.session.user
    // webSocketData(user)

    onAuthStateChanged(auth,
        (user) => {
            if (!user) {
                console.log('before return');
                res.status(401).redirect('/log-in');
                return
            } else {
                console.log('got to the end');
                next();
            }
        });
}

//expApp.use(webSocketData)

expApp.use(authCheck);

//expApp.use(restricted, getRoutes.getProfileData)

expApp.set("view engine", "ejs");

expApp.post("/login", loginAuth.logIn,)

expApp.post("/create", email_PasswordAuth.signUp)

expApp.post("/updateUserInfo", restricted, userData.updateUserData)

expApp.post("/profileSetup", restricted, upload.single('imageFile'), setUserData.setupProfile)

expApp.post('/sendmail', sendMail.sendMail);

//expApp.get("/setprofile", getRoutes.profileSetup);

expApp.get('/api/logInData', loginAuth.logInDataApi)

expApp.get('/logout', logoutAuth.logOut)

expApp.get('/accountDelete', accountDelete.accountDelete)

expApp.get('/api/Data', email_PasswordAuth.signUpDataApi)

expApp.get('/', getRoutes.landingPage);

expApp.get("/sign-up", getRoutes.signUp);

expApp.get("/setprofile", getRoutes.profileSetup);

expApp.get("/log-in", getRoutes.logIn);

expApp.get("/partials", getRoutes.partials);

expApp.get("/partials/profile", getRoutes.partials_profile);

expApp.get("/partials/home", getRoutes.partials_home)

expApp.get("/data", getRoutes.data);

expApp.get("/airtime", getRoutes.airtime);

expApp.get("/dashboard", getRoutes.dashboard);

expApp.use((err, req, res, next) => {
    console.error('Nwigiri', err.stack);
    console.error('Nwigiri', err.message);
    next()
});

expApp.use((req, res, next) => {
    return res.status(404).render('404');
});

expApp.listen(port, () => {
    console.log(`Access Server On http://localhost:${port}`);
});