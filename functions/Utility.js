require('dotenv').config();
const express = require('express');
const fs = require('fs');
// const https = require('https');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const {
  onAuthStateChanged
} = require("firebase/auth");

//uncomment this for local dev
const port = 9090;
const host = 'localhost';

// Initialize Express app
const app = express();

// const httpsServer = https.createServer(app);

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
  onAuthStateChanged(auth, async (user) => {
    if (!res.headersSent) {
      if (user) {
        next()
      } else {
        return res.render('log-in')
      }
    }
  }); 
}
 
const dynamicData = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    console.log('sent');
  };

  function authStates() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        let profileData = await getRoutes.getProfileData(user) || {};
        let { names, phone, gender, country } = profileData;

        let displayName = user.displayName;

        const dataToSend = {
          names: names,
          phone: phone,
          displayName: displayName,
          gender: gender,
          country: country,
          email: user.email,
          photoURL: user.photoURL
        };
        sendEvent(dataToSend);
      } else {
        sendEvent({ message: 'User is not logged in' });
      }
    });
  }

  authStates();
};

let logout = {
  state: '#logout',
  view: `<button id="logout" style="background-color:#dc3545;" class="auth">
  <i class="fa-solid fa-arrow-right-from-bracket"></i> &nbsp; Logout
  </button>`,
  remove: `<button style="background-color:#dc3545" id="delete" class="delete"> <i class="fa-solid fa-trash"></i>&nbsp;Delete Account</button>`,
  auth: `<button style="background-color:#dc3545;" id="prof-logout" class="prof-logout">  <i class="fa-solid fa-arrow-right-from-bracket"></i> &nbsp;Logout</button>`,
  authState: '#prof-logout'
};

let login = {
  state: '#login',
  view: `<button class="auth" id="login">
  <i class="fa-solid fa-right-to-bracket"></i> &nbsp; Login
  </button>`,
  auth: `<button style="background-color:green" id="prof-login" class="prof-login">  <i class="fa-solid fa-right-to-bracket"></i>&nbsp;LogIn</button>`,
  authState: '#prof-login'
};

const isUser = (req, res) => {
  onAuthStateChanged(auth,
    async (user) => {
      if (!res.headersSent) {
        if (user) {
          return res.json(logout);
        } else {
          return res.json(login);
        }
      }
    });
};


// Route Definitions
app.post("/login", loginAuth.logIn);

app.post("/create", email_PasswordAuth.signUp);

app.post("/updateUserInfo", userData.updateUserData);

app.post("/profileSetup", multer({
  storage: multer.memoryStorage()
}).single('imageFile'), setUserData.setupProfile);

app.post('/sendmail', sendMail.sendMail);

app.get('/logout', logoutAuth.logOut);

app.get('/accountDelete', accountDelete.accountDelete);

// Sample data endpoint
app.get('/api/dynamic-data', dynamicData)

app.get('/isUser', isUser)

app.get('/', getRoutes.landingPage);

app.get("/sign-up", getRoutes.signUp);

app.get("/setprofile", getRoutes.profileSetup);

app.get("/log-in", getRoutes.logIn);

// app.get("/partials", getRoutes.partials);

app.get("/partials/profile", getRoutes.partials_profile);

app.get("/partials/home", getRoutes.partials_home);

app.get("/data", getRoutes.data);

app.get("/airtime", getRoutes.airtime);

app.get("/dashboard", getRoutes.dashboard);

// General Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  console.error('Message:', err.message);
  res.status(500).render('500'); // Assuming you have a 500 error template
});

// 404 Error Handling Middleware
app.use((req, res, next) => {
  res.status(404).render('404'); // Assuming you have a 404 error template
});

//uncomment this for local dev
app.listen(port, () => {
  console.log(`Access Server On http://${host}:${port}`);
});

module.exports = app