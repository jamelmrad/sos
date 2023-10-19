var express = require('express');
var router = express.Router();
const user = require("../../controllers/Users/userController.js");

// Retrieve all Users Admin
router.get("/find-all", user.findAllUsers);
// Retrieve all Users Client
router.get("/find-all-clients", user.findClientUsers);
// Retrieve a single User with email
router.get("/email/:email", user.findUserByEmail);
// Retrieve a single User with id
router.get("/find/:id", user.findUserById);
// Create a new User
router.post("/create", user.createUser);
// Update a User with id
router.put("/update/:id", user.updateUser);
// Delete a User with id
router.delete("/delete/:id", user.deleteUser);
// Register a user
router.post("/register", user.registerUser);
// Send sms
router.post("/sendSMS", user.sendSMS);
// Verify SMS code
router.post("/verify", user.verify);



module.exports = router; 