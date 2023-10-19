const sgMail = require('@sendgrid/mail')
API_KEY = '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'
const User = require('../models/Users/user')
const tokenForUser = require('../utils/tokengenerator');
const { generateRandomDigits } = require('./Users/userController');

const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "cf7ae301",
  apiSecret: "guLAcuhelUWYLcY8"
})

sgMail.setApiKey(API_KEY)
// Send email that contains a link for reset pwd
exports.send = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }) // find user
  if (user) { // if we fond the user
    const token = tokenForUser(user) // generates new token
    user.resettoken = token // affecting token to the user
    await user.save() // saving the user
    const link = `${req.protocol}://localhost:3000/reset-password?token=${token}` // generating link
    await sgMail.send({
      to: req.body.email,
      from: 'wacef.stratrait@gmail.com',
      subject: 'Reset password',
      html:
        `<div>Click the link below to reset your password</div>
        <br/>
        <div>${link}</div>`
    }) // sending the email
      .then(data => res.send({ result: data }))
      .catch(err => res.send(err))
  }
  else { // user not found
    res.status(404).send({ message: 'User not found !' })
  }
}

exports.resetPassword = async (req, res) => {
  const { newPassword, token } = req.body
  const user = await User.findOne({ resettoken: token })
  if (user) {
    user.password = newPassword
    await user.save()
    return res.send({ message: "Password updated successfully !" })
  }
  res.status(404).send({ message: `User not found !` })
}

exports.sendSMSReset = async (req, res) => {
  const user = await User.findOne({ phone: req.body.phone })
  if (user) {
    const x = generateRandomDigits()
    user.resetCode = x
    await user.save()
    const from = "SeaSOS"
    const to = `${user.countryCode}${user.phone}`
    const text = x + " is your reset password code. For your security, do not share this code."
    vonage.sms.send({ to, from, text })
      .then(resp => {
        res.send({
            resetcode: x,
            phone: user.phone
          });
      })
      .catch(err => {
        res.send({ message: 'There was an error sending the messages.', error: err })
      });
  }
  else {
    res.status(404).send({ message: 'User not found !' })
  }
};

exports.resetPasswordMobile = async (req, res) => {
  const { newPassword, phone, resetCode } = req.body
  const user = await User.findOne({ phone: phone })
  if (user) {
    if (parseInt(user.resetCode) == parseInt(resetCode)) {
      user.password = newPassword
      user.resetCode = ''
      await user.save()
      return res.send({ message: "Password updated successfully !" })
    }
    else {
      res.status(500).send({ message: `Reset code is not correct` })
    }
  }
  else {
    res.status(404).send({ message: `User not found !` })
  }
}

exports.verifResetPasswordMobile = async (req, res) => {
  const { phone, resetCode } = req.body
  const user = await User.findOne({ phone: phone })
  if (user) {
    if (parseInt(user.resetCode) == parseInt(resetCode)) {
      return res.send(true)
    }
    else {
      return res.send(false)
    }
  }
  else {
    return res.status(404).send({ message: `User not found !` })
  }
}