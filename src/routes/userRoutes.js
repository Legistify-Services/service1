const router = require("express").Router();
const { signIn, signUp, findRole } = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  res.json({ message: "signin, signup, findrole" });
});
router.get("/signin", signIn);
router.post("/signup", signUp);
router.get("/findrole", auth, findRole);

module.exports = router;
