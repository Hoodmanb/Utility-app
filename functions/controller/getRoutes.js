const {
    head,
    indexhead,
    bootstrap
} = require('../../assets/js-files/partials');

const authObj = require('../auth')
const auth = authObj.auth;
const app = authObj.app;

const {
    doc,
    getDoc,
    getFirestore,
} = require('firebase/firestore')

const firestore = getFirestore(app);
const user = auth.currentUser

//let names, gender, phone;

async function getProfileData(user = user) {
    if (!user) {
        console.log('User is Not Logged In GetProfile');
        return;
        // return res.status(401).send('Unauthorized');
    }
    try {
        //const user = auth.currentUser;

        let userId = user.uid

        if (!userId) {
            console.log('No user ID found in session.');
            //return res.status(400).send('Bad Request');
            return;
        }

        const docRef = doc(firestore, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let userInfo = docSnap.data();
            console.log(userInfo.names);
            console.log("Document data:", docSnap.data());
            names = userInfo.names ? userInfo.names: '';
            phone = userInfo.phone ? userInfo.phone: '';
            gender = userInfo.gender ? userInfo.gender: '';
            country = userInfo.country ? userInfo.country: '';
            
            return {
                names,
                phone,
                gender,
                country
            }
            //next();
        } else {
            console.log("No such document!");
            //next();
        }
    } catch (error) {
        console.error('Error getting user data:', error.message);
        //res.status(500).send('Internal Server Error');
        return;
    }
}

const landingPage = (req, res) => {
    res.render('landingpage', {
        head: head
    })
}
const dashboard = (req, res) => {
    let user =  null;
    //  console.log(user.uid)
    res.render("index",
        {
            head: head,
            indexhead: indexhead,
            user: user
        });
};

const signUp = (req, res) => {
    res.render("sign-up",
        {
            head: head,
            bootstrap: bootstrap
        });
}

const logIn = (req, res) => {
    res.render("log-in",
        {
            head: head,
            bootstrap: bootstrap
        });
}

const profileSetup = (req, res) => {
    res.render('setprofile', {
        head: head
    })
}

const partials = (req, res) => {
    res.render("partials",
        {
            head: head
        });
}

const partials_profile = (req, res) => {
    res.render("partials",
        {
            head: head
        });
}

const partials_home = (req, res) => {
    res.render("partials/home",
        {
            head: head
        });
}

const data = (req, res, next) => {
    res.render('data',
        {
            head: head,
            bootstrap
        })
}

const airtime = (req, res) => {
    res.render("airtime",
        {
            head: head,
            bootstrap
        });
}


module.exports = {
    signUp,
    partials,
    partials_profile,
    partials_home,
    logIn,
    dashboard,
    data,
    airtime,
    getProfileData,
    profileSetup,
    landingPage
}