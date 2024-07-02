const nodemailer = require('nodemailer')

const sendMail = (req, res) => {
    const {
        name,
        email,
        message
    } = req.body
    //console.log(name, email, message)
    const transporter = nodemailer.createTransport({
        //service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        //secure: true,
        auth: {
            user: process.env.SENDING_EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    //console.log(transporter)
    const text = Object.keys(req.body)
    .map(key => `${key}: ${req.body[key]}`)
    .join('\n');

    const mailOptions = {
        to: process.env.RECIECING_EMAIL,
        from: email,
        subject: 'message from utility app',
        text: text
    }
    //console.log(mailOptions)
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error)
            return res.status(500).send(error.toString());
        }
        console.log(info)
        res.status(200).send({message:'successful!'});
    });
}

module.exports = {
    sendMail
}