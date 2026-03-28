import { useState } from "react";
import "../styles/navbar.css";

export default function Navbar({ onSearch, onFilter, labelOptions = [], employeeOptions = [] }) {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    const handleFilter = (e) => {
        onFilter(e.target.value);
    };

    return (
        <div className="navbar">
            {/* Left Section */}
            <h2 className="navbar-title">Assignment</h2>

            {/* Right Section */}
            <div className="navbar-right">
                <input
                    type="text"
                    placeholder="🔍 Search tasks..."
                    value={query}
                    onChange={handleSearch}
                    className="navbar-input"
                />

                <select
                    onChange={handleFilter}
                    className="navbar-select"
                >
                    <option value="">Select</option>
                    <option value="nearest">Closest Deadline</option>
                    <option value="farthest">Farthest Deadline</option>
                    {labelOptions.length > 0 && (
                        <optgroup label="By Label">
                            {labelOptions.map((label) => (
                                <option key={`label-${label}`} value={`label:${label}`}>
                                    Label: {label}
                                </option>
                            ))}
                        </optgroup>
                    )}
                    {employeeOptions.length > 0 && (
                        <optgroup label="By Employee">
                            {employeeOptions.map((employee) => (
                                <option key={`employee-${employee}`} value={`employee:${employee}`}>
                                    Employee: {employee}
                                </option>
                            ))}
                        </optgroup>
                    )}
                </select>
            </div>
        </div>
    );
}
