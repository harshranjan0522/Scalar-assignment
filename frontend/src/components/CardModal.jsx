import { useState } from "react";
import { createPortal } from "react-dom";
import API from "../services/api";
import "../styles/modal.css";

export default function CardModal({ card, close, onCardUpdated }) {
    const predefinedEmployees = ["Aarav", "Isha", "Kabir", "Meera", "Rohan", "Siya"];
    const [title, setTitle] = useState(card.title);
    const [desc, setDesc] = useState(card.description || "");
    const [label, setLabel] = useState("");
    const [color, setColor] = useState("#ff0000");
    const [date, setDate] = useState(card.due_date || "");
    const [localLabels, setLocalLabels] = useState(card.labels ? card.labels.split(",") : []);
    const [localColors, setLocalColors] = useState(card.colors ? card.colors.split(",") : []);
    const [localAssignees, setLocalAssignees] = useState(card.assignees ? card.assignees.split(",") : []);
    const [selectedEmployee, setSelectedEmployee] = useState(predefinedEmployees[0]);

    const addLabel = async () => {
        if (!label.trim()) return;

        const res = await API.post("/labels", {
            name: label.trim(),
            color,
            card_id: card.id,
        });

        const updated = res.data.card;
        if (updated) {
            onCardUpdated?.(updated);
            setLocalLabels(updated.labels ? updated.labels.split(",") : []);
            setLocalColors(updated.colors ? updated.colors.split(",") : []);
        } else {
            setLocalLabels((prev) => [...prev, label.trim()]);
            setLocalColors((prev) => [...prev, color]);
        }

        setLabel("");
    };

    const addAssignee = async () => {
        let res;
        try {
            res = await API.post("/assignees", {
                card_id: card.id,
                employee_name: selectedEmployee,
            });
        } catch (error) {
            return;
        }

        const updated = res?.data?.card;
        if (updated) {
            onCardUpdated?.(updated);
            setLocalAssignees(updated.assignees ? updated.assignees.split(",") : []);
        }
    };

    const removeAssignee = async (employeeName, index) => {
        let res;
        try {
            res = await API.delete("/assignees", {
                data: {
                    card_id: card.id,
                    employee_name: employeeName,
                },
            });
        } catch (error) {
            try {
                res = await API.post("/assignees/remove", {
                    card_id: card.id,
                    employee_name: employeeName,
                });
            } catch {
                return;
            }
        }

        const updated = res?.data?.card;
        if (updated) {
            onCardUpdated?.(updated);
            setLocalAssignees(updated.assignees ? updated.assignees.split(",") : []);
        } else {
            setLocalAssignees((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const removeLabel = async (name, labelColor, labelIndex) => {
        let res;
        try {
            res = await API.delete("/labels", {
                data: {
                    name,
                    color: labelColor,
                    card_id: card.id,
                },
            });
        } catch (error) {
            res = await API.post("/labels/remove", {
                name,
                color: labelColor,
                card_id: card.id,
            });
        }

        const updated = res?.data?.card;
        if (updated) {
            onCardUpdated?.(updated);
            setLocalLabels(updated.labels ? updated.labels.split(",") : []);
            setLocalColors(updated.colors ? updated.colors.split(",") : []);
        } else {
            setLocalLabels((prev) => prev.filter((_, i) => i !== labelIndex));
            setLocalColors((prev) => prev.filter((_, i) => i !== labelIndex));
        }
    };

    const save = async () => {
        let saved = false;
        try {
            await API.put(`/cards/${card.id}`, {
                title,
                description: desc,
                due_date: date || null,
            });
            saved = true;
        } catch (error) {
            try {
                await API.post(`/cards/update/${card.id}`, {
                    title,
                    description: desc,
                    due_date: date || null,
                });
                saved = true;
            } catch (fallbackError) {
                console.error("Failed to save card:", fallbackError);
                return;
            }
        }

        if (saved) {
            close();
            window.location.reload();
        }
    };

    const deleteCard = async () => {
        try {
            await API.delete(`/cards/${card.id}`);
        } catch (error) {
            await API.post(`/cards/delete/${card.id}`);
        }
        close();
        window.location.reload();
    };

    return createPortal(
        <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Card title" />

                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />

                <div className="labels">
                    {localLabels.map((item, i) => (
                        <span
                            key={`${card.id}-modal-label-${item}-${i}`}
                            className="label"
                            style={{ background: localColors[i] }}
                        >
                            {item}
                            <span
                                role="button"
                                tabIndex={0}
                                style={{ marginLeft: "6px", cursor: "pointer", fontWeight: "700" }}
                                onClick={() => removeLabel(item, localColors[i], i)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        removeLabel(item, localColors[i], i);
                                    }
                                }}
                            >
                                x
                            </span>
                        </span>
                    ))}
                </div>

                <h4>Due Date</h4>
                <input type="date" value={date ? String(date).slice(0, 10) : ""} onChange={(e) => setDate(e.target.value)} />

                <h4>Labels</h4>
                <input placeholder="Label name" value={label} onChange={(e) => setLabel(e.target.value)} />
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                <button onClick={addLabel}>Add Label</button>

                <h4>Employees</h4>
                <div className="labels">
                    {localAssignees.map((name, i) => (
                        <span key={`${card.id}-employee-${name}-${i}`} className="label" style={{ background: "#334155" }}>
                            {name}
                            <span
                                role="button"
                                tabIndex={0}
                                style={{ marginLeft: "6px", cursor: "pointer", fontWeight: "700" }}
                                onClick={() => removeAssignee(name, i)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        removeAssignee(name, i);
                                    }
                                }}
                            >
                                x
                            </span>
                        </span>
                    ))}
                </div>
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                    {predefinedEmployees.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
                <button onClick={addAssignee}>Add Employee</button>

                <div style={{ marginTop: "10px" }}>
                    <button onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await save(); }}>Save</button>
                    <button onClick={(e) => { e.stopPropagation(); deleteCard(); }}>Delete Card</button>
                    <button onClick={(e) => { e.stopPropagation(); close(); }}>Close</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

