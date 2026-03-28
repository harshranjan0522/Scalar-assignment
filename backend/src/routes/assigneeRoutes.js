const router = require("express").Router();
const ctrl = require("../controllers/assigneeController");

router.get("/employees", ctrl.getPredefinedEmployees);
router.post("/", ctrl.addAssigneeToCard);
router.delete("/", ctrl.removeAssigneeFromCard);
router.post("/remove", ctrl.removeAssigneeFromCard);

module.exports = router;
