import Board from "../components/Board";
import Navbar from "../components/Navbar";
import { useState } from "react";

function Home() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [filterOptions, setFilterOptions] = useState({ labels: [], employees: [] });

    return (
        <>
        <Navbar
            onSearch={setSearch}
            onFilter={setFilter}
            labelOptions={filterOptions.labels}
            employeeOptions={filterOptions.employees}
        />
        <Board search={search} filter={filter} onFilterOptionsChange={setFilterOptions} />
        </>
    );
}

export default Home;
