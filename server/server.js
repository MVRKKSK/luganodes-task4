const express = require("express")
const app = express()
const cors = require("cors")
const PORT = 8000
const morgan = require("morgan")
const { readdirSync, read } = require("fs")
const bodyParser = require("body-parser")
const dotenv = require('dotenv')
dotenv.config()
const db = require("./utils/db")
db();
app.use(cors())
app.use(morgan("dev"))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)))
app.get("/", (req, res) => {
    res.send("Unleash The Bankai")
})
app.listen(PORT, (req, res) => {
    console.log("server is connected")
})