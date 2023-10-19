var express = require('express');
var router = express.Router();
const controller = require('../../controllers/Boats/boatController');

// Create a boat
router.post("/create", controller.create);
// Get all boats
router.get("/find-all", controller.findAll);
// Update a boat with id
router.put("/update/:id", controller.update);
// Delete a boat with id
router.delete("/delete/:id", controller.delete);

module.exports = router;