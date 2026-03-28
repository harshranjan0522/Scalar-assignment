const PREDEFINED_EMPLOYEES = [
    "Aarav",
    "Isha",
    "Kabir",
    "Meera",
    "Rohan",
    "Siya",
];

const ensureAssigneeTable = async (db) => {
    await db.query(
        `
        CREATE TABLE IF NOT EXISTS card_assignees (
            id INT AUTO_INCREMENT PRIMARY KEY,
            card_id INT NOT NULL,
            employee_name VARCHAR(100) NOT NULL,
            UNIQUE KEY uniq_card_employee (card_id, employee_name)
        )
        `
    );
};

module.exports = {
    PREDEFINED_EMPLOYEES,
    ensureAssigneeTable,
};
