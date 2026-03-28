const db = require("../config/db");

exports.createList = async (req, res) => {
    const { title, board_id } = req.body;
    const [rows] = await db.query("SELECT COUNT(*) as count FROM lists WHERE board_id=?",[board_id]);
    await db.query("INSERT INTO lists (title, board_id, position) VALUES (?, ?, ?)",[title, board_id, rows[0].count]);
    res.send("created");
};  

exports.reorderLists = async (req, res) => {
    const { lists } = req.body;
    for (let i = 0; i < lists.length; i++) {
        await db.query("UPDATE lists SET position=? WHERE id=?", [i,lists[i].id,]);
    }
    res.send("done");
};

exports.renameList = async (req, res) => {
    const listId = Number(req.params.id);
    const title = String(req.body?.title || "").trim();

    if (!Number.isInteger(listId) || listId <= 0) {
        return res.status(400).json({ message: "Invalid list id" });
    }

    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    const [result] = await db.query("UPDATE lists SET title=? WHERE id=?", [title, listId]);
    if (!result.affectedRows) {
        return res.status(404).json({ message: "List not found" });
    }

    res.json({ id: listId, title });
};

exports.deleteList = async (req, res) => {
    const listId = Number(req.params.id);
    if (!Number.isInteger(listId) || listId <= 0) {
        return res.status(400).json({ message: "Invalid list id" });
    }

    const [rows] = await db.query("SELECT board_id FROM lists WHERE id=?", [listId]);
    if (!rows.length) {
        return res.status(404).json({ message: "List not found" });
    }

    const boardId = rows[0].board_id;

    await db.query(
        `
        DELETE cl
        FROM card_labels cl
        INNER JOIN cards c ON c.id = cl.card_id
        WHERE c.list_id = ?
        `,
        [listId]
    );
    await db.query("DELETE FROM cards WHERE list_id=?", [listId]);
    await db.query("DELETE FROM lists WHERE id=?", [listId]);

    const [remainingLists] = await db.query(
        "SELECT id FROM lists WHERE board_id=? ORDER BY position, id",
        [boardId]
    );

    for (let i = 0; i < remainingLists.length; i++) {
        await db.query("UPDATE lists SET position=? WHERE id=?", [i, remainingLists[i].id]);
    }

    res.send("deleted");
};
