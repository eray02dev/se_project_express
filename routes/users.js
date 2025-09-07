const router = require("express").Router();
const { getCurrentUser, updateMe } = require("../controllers/users");
const { validateUpdateMe } = require("../utils/validators");

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateMe, updateMe);

module.exports = router;
