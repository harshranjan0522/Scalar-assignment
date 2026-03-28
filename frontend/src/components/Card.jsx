import { Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { createPortal } from "react-dom";
import API from "../services/api";
import CardModal from "./CardModal";
import "../styles/card.css";

export default function Card({ card, listId, index, onCardUpdated }) {
    const [open, setOpen] = useState(false);
    const isCompleted = Boolean(card.is_completed);

    const toggle = async (e) => {
        e.stopPropagation();
        const res = await API.put(`/cards/toggle/${card.id}`);
        onCardUpdated?.(res.data.card);
    };

    const labels = card.labels ? card.labels.split(",") : [];
    const colors = card.colors ? card.colors.split(",") : [];

    const isLate = card.due_date && new Date(card.due_date) < new Date();

    return (
        <>
            <Draggable draggableId={`card-${listId}-${card.id}`} index={index}>
                {(provided, snapshot) => (
                    (() => {
                        const cardNode = (
                            <div
                        className={`card ${isCompleted ? "completed" : ""} ${snapshot.isDragging ? "dragging" : ""}`}
                        onClick={() => setOpen(true)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                            ...provided.draggableProps.style,
                            zIndex: snapshot.isDragging ? 1000 : "auto",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={toggle}
                            onClick={(e) => e.stopPropagation()}
                        />

                        <div {...provided.dragHandleProps}>
                            <div className="labels">
                                {labels.map((label, i) => (
                                    <span
                                        key={`${card.id}-${label}-${i}`}
                                        style={{ background: colors[i] }}
                                        className="label"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>

                            <h4>{card.title}</h4>

                            {card.description && <p className="desc">{card.description}</p>}

                            {card.due_date && (
                                <div className={`deadline ${isLate ? "late" : ""}`}>
                                    {new Date(card.due_date).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                        );

                        return snapshot.isDragging ? createPortal(cardNode, document.body) : cardNode;
                    })()
                )}
            </Draggable>

            {open && <CardModal card={card} close={() => setOpen(false)} onCardUpdated={onCardUpdated} />}
        </>
    );
}
