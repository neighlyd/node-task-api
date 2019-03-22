const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'neighlyd@gmail.com',
        subject: 'Welcome to the Task App',
        text: `Hello ${name}, Thank you for signing up to the Task App. If you have any questions, let us know. Thanks, The Staff`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'neighlyd@gmail.com',
        subject: 'We\'re sorry to see you go',
        text: `Hello ${name}, We're really sorry to see you go. Is there anything we could do to change the Task app to get you to come back?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}