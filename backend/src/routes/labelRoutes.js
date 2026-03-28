const router = require("express").Router();
const ctrl = require("../controllers/labelController");

router.post("/", ctrl.addLabelToCard);
router.delete("/", ctrl.removeLabelFromCard);
router.post("/remove", ctrl.removeLabelFromCard);

module.exports = router;
