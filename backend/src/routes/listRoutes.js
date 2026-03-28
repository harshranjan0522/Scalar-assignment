const router = require("express").Router();
const ctrl = require("../controllers/listController");

router.post("/", ctrl.createList);
router.put("/reorder", ctrl.reorderLists);
router.put("/:id", ctrl.renameList);
router.post("/update/:id", ctrl.renameList);
router.delete("/:id", ctrl.deleteList);
router.post("/delete/:id", ctrl.deleteList);

module.exports = router;
