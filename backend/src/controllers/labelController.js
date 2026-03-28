const db = require("../config/db");
const { getCardById } = require("./cardController");

exports.addLabelToCard = async (req, res) => {
    const { name, color, card_id } = req.body;

    if (!name || !color || !card_id) {
        return res.status(400).json({ message: "name, color and card_id are required" });
    }

    const [existingLabels] = await db.query(
        "SELECT id FROM labels WHERE name=? AND color=? LIMIT 1",
        [name, color]
    );

    let labelId = existingLabels[0]?.id;

    if (!labelId) {
        const [labelResult] = await db.query(
            "INSERT INTO labels (name, color) VALUES (?, ?)",
            [name, color]
        );
        labelId = labelResult.insertId;
    }

    const [existingRelation] = await db.query(
        "SELECT 1 FROM card_labels WHERE card_id=? AND label_id=? LIMIT 1",
        [card_id, labelId]
    );

    if (!existingRelation.length) {
        await db.query(
            "INSERT INTO card_labels (card_id, label_id) VALUES (?, ?)",
            [card_id, labelId]
        );
    }

    const card = await getCardById(card_id);
    res.json({ card });
};

exports.removeLabelFromCard = async (req, res) => {
    const payload = req.method === "DELETE" ? req.body : req.body;
    const { name, color, card_id } = payload;

    if (!name || !color || !card_id) {
        return res.status(400).json({ message: "name, color and card_id are required" });
    }

    const [labels] = await db.query(
        "SELECT id FROM labels WHERE name=? AND color=? LIMIT 1",
        [name, color]
    );

    if (labels.length) {
        const labelId = labels[0].id;
        await db.query(
            "DELETE FROM card_labels WHERE card_id=? AND label_id=?",
            [card_id, labelId]
        );
    }

    const card = await getCardById(card_id);
    res.json({ card });
};
