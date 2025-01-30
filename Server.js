require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get("/test", (req, res) => {
    db.query("SELECT * FROM task_object", (err, results) => {
        if (err) {
            return res.status(500).send("факингмазафакинг");
        }
        res.json(results);
    });
});

app.post("/test", (req, res) => {
    try {
        console.log("Полученные данные:", req.body);

        if(!req.body ){
            console.log("Second check was works");
            return res.status(400).json({ error: "Неверный формат данных" });
        }
        if (!Array.isArray(req.body)) {
            console.log("First check was works");
            return res.status(400).json({ error: "Неверный формат данных" });
        }
        const sql = "INSERT INTO task_object (type, content) VALUES ?";
        const values = req.body.map(item => [item.type, item.content]);

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("Ошибка при вставке данных:", err);
                return res.status(500).json({ error: "Ошибка при добавлении" });
            }
            res.json({ success: true, inserted: result.affectedRows });
        });

    } catch (error) {
        console.error("Ошибка сервера:", error.message);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.listen(process.env.PORT, () => console.log(`Сервер запущен на порту ${process.env.PORT}`));
