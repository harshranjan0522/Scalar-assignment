const db = require("../config/db");
const { ensureAssigneeTable } = require("../utils/assignees");

exports.getBoardData = async (req, res) => {
    try {
        await ensureAssigneeTable(db);
        // Get board
        const [boards] = await db.query("SELECT * FROM boards LIMIT 1");

        if (boards.length === 0) {
            return res.status(404).json({ message: "Board not found" });
        }

        const board = boards[0];

        // Get lists
        const [lists] = await db.query(
            "SELECT * FROM lists WHERE board_id=? ORDER BY position",
            [board.id]
        );

        // Get cards with labels
        for (let list of lists) {
            const [cards] = await db.query(
                `
                SELECT 
                    c.*, 
                    GROUP_CONCAT(DISTINCT l.name ORDER BY l.id SEPARATOR ',') AS labels,
                    GROUP_CONCAT(DISTINCT l.color ORDER BY l.id SEPARATOR ',') AS colors,
                    GROUP_CONCAT(DISTINCT ca.employee_name ORDER BY ca.employee_name SEPARATOR ',') AS assignees
                FROM cards c
                LEFT JOIN card_labels cl ON c.id = cl.card_id
                LEFT JOIN labels l ON cl.label_id = l.id
                LEFT JOIN card_assignees ca ON c.id = ca.card_id
                WHERE c.list_id = ?
                GROUP BY c.id
                ORDER BY c.position
                `,
                [list.id]
            );

            list.cards = cards;
        }

        res.json({ board, lists });

    } catch (error) {
        console.error("Error fetching board data:", error);
        res.status(500).json({ message: "Server error" });
    }
};
