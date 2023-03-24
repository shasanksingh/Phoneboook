const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contacts.controller");
const passport = require("passport");

router.get("/", contactController.index);
router.get("/create", contactController.create);
router.post("/", contactController.store);
router.get("/:id", contactController.show);
router.get("/:id/edit", contactController.edit);
router.put("/:id", contactController.update);
router.put("/:id", contactController.destroy);

module.exports = router;
