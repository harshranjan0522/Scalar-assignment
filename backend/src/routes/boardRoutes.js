const router = require("express").Router();
const ctrl = require("../controllers/boardController");

router.get("/", ctrl.getBoardData);

module.exports = router;