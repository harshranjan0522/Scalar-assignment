const db = require("../config/db");
const { getCardById } = require("./cardController");
const { PREDEFINED_EMPLOYEES, ensureAssigneeTable } = require("../utils/assignees");

exports.addAssigneeToCard = async (req, res) => {
    const { card_id, employee_name } = req.body;
    const cardId = Number(card_id);
    const employeeName = String(employee_name || "").trim();

    if (!Number.isInteger(cardId) || cardId <= 0 || !employeeName) {
        return res.status(400).json({ message: "card_id and employee_name are required" });
    }

    if (!PREDEFINED_EMPLOYEES.includes(employeeName)) {
        return res.status(400).json({ message: "employee_name must be a predefined employee" });
    }

    await ensureAssigneeTable(db);
    await db.query(
        "INSERT IGNORE INTO card_assignees (card_id, employee_name) VALUES (?, ?)",
        [cardId, employeeName]
    );

    const card = await getCardById(cardId);
    res.json({ card, employees: PREDEFINED_EMPLOYEES });
};

exports.removeAssigneeFromCard = async (req, res) => {
    const { card_id, employee_name } = req.body;
    const cardId = Number(card_id);
    const employeeName = String(employee_name || "").trim();

    if (!Number.isInteger(cardId) || cardId <= 0 || !employeeName) {
        return res.status(400).json({ message: "card_id and employee_name are required" });
    }

    await ensureAssigneeTable(db);
    await db.query(
        "DELETE FROM card_assignees WHERE card_id=? AND employee_name=?",
        [cardId, employeeName]
    );

    const card = await getCardById(cardId);
    res.json({ card, employees: PREDEFINED_EMPLOYEES });
};

exports.getPredefinedEmployees = async (_req, res) => {
    res.json({ employees: PREDEFINED_EMPLOYEES });
};
