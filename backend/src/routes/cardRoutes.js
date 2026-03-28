const router = require("express").Router();
const ctrl = require("../controllers/cardController");

router.post("/", ctrl.createCard);
router.put("/reorder", ctrl.reorderCards);

// ✅ Put this BEFORE /:id
router.put("/toggle/:id", ctrl.toggleComplete);

router.put("/:id", ctrl.updateCard);
router.post("/update/:id", ctrl.updateCard);
router.delete("/:id", ctrl.deleteCard);
router.post("/delete/:id", ctrl.deleteCard);

module.exports = router;
