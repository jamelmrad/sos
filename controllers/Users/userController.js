const User = require("../../models/Users/user");
const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "cf7ae301",
  apiSecret: "guLAcuhelUWYLcY8"
})

// get admins
exports.findAllUsers = async (req, res) => {
  const { query, page, limit = 10 } = req.query
  const options = {
    page,
    limit,
    collation: {
      locale: 'en'
    }
  }
  const regexQuery = new RegExp(query, 'i')
  try {
    const users = await User.paginate({ fullname: regexQuery, role: 'ADMIN' }, options);
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message:
        err || "Some error occurred while retrieving users."
    });
  }
};
// get clients
exports.findClientUsers = async (req, res) => {
  const { query, page, limit = 10 } = req.query
  const options = {
    page,
    limit,
    collation: {
      locale: 'en'
    }
  }
  const regexQuery = new RegExp(query, 'i')
  try {
    const users = await User.paginate({ fullname: regexQuery, role: 'CLIENT' }, options);
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message:
        err || "Some error occurred while retrieving users."
    });
  }
};
// create admin
exports.createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(422).send({
        message: "User already exists with email " + req.body.email
      });
    }
    const newUser = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      role: "ADMIN",
      gender: req.body.gender,
      phone: req.body.phone,
      address: req.body.address,
    });
    await newUser.save();
    res.status(200).send({
      message: "User created succssfuly."
    });
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while creating the user." + err
    });
  }
};
// update user
exports.updateUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  try {
    await User.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
    return res.send({ message: "User was updated successfully." });
  } catch (err) {
    res.status(500).send({
      message: "Error updating user with id=" + req.params.id
    });
  }
}
// delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.send({ message: "User deleted successfully!" });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete user with id=" + req.params.id
    });
  }
};
// find user by email
exports.findUserByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "Not found user with email " + email });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving user with email=" + email });
  }
};
// find user by email
exports.findUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

// register user mobile
exports.registerUser = async (req, res) => {
  try {
    const newUser = new User({
      fullname: req.body.fullname,
      cin: req.body.cin,
      passport: req.body.passport,
      password: req.body.password,
      role: "CLIENT",
      nationality: req.body.nationality,
      phone: req.body.phone,
      verifCode: this.generateRandomDigits(),
      countryCode: req.body.countryCode
    });
    const response = await newUser.save();
    res.status(200).send({ response });
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while creating the user." + err
    });
  }
};

// send sms

exports.sendSMS = async (req, res) => {
  const user = await User.findById(req.body.phoneNumber)
  if (user) {
    const code = this.generateRandomDigits()
    user.verifCode = code
    await user.save()
    const from = "SeaSOS"
    const to = `${user.countryCode}${user.phone}`
    const text = code + " is your verification code. For your security, do not share this code."
    vonage.sms.send({ to, from, text })
      .then(resp => {
        res.send({ phoneNumber: user.phone, verifCode: code });
      })
      .catch(err => {
        res.send({ message: 'There was an error sending the messages.', error: err })
      });
  }
  else {
    res.status(404).send({ message: 'User not found !' })
  }
};
// verify sms
exports.verify = async (req, res) => {
  const { verifCode, phoneNumber } = req.body;
  if (!verifCode || !phoneNumber) {
    return res.send({ message: 'Code or user id is missing!' });
  }
  try {
    const user = await User.findOne({ phone: phoneNumber, role: 'CLIENT' });

    if (!user) {
      return res.status(404).send({ message: 'User not found!' });
    }

    if (parseInt(verifCode) === parseInt(user.verifCode)) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (error) {
    return res.status(500).send({ message: 'An error occurred while verifying.' });
  }
}


// Generate four random digits
exports.generateRandomDigits = () => {
  let result = '';
  for (let i = 0; i < 4; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    result += randomDigit;
  }
  return result;
}




