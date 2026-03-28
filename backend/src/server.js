const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/boards", require("./routes/boardRoutes"));
app.use("/lists", require("./routes/listRoutes"));
app.use("/cards", require("./routes/cardRoutes"));
app.use("/labels", require("./routes/labelRoutes"));
app.use("/assignees", require("./routes/assigneeRoutes"));

app.listen(5000, () => console.log("Server running"));
