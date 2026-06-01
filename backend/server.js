const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

// ================= DATABASE =================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "SMS"
});

db.connect((err) => {
    if (err) console.log(err);
    else console.log("Database Connected Successfully");
});


// ================= REGISTER =================
app.post("/register", async (req, res) => {

    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users(username,password) VALUES (?,?)";

        db.query(sql, [username, hashedPassword], (err) => {

            if (err) return res.status(500).json(err);

            res.json({ message: "User Registered Successfully" });
        });

    } catch (error) {
        res.status(500).json(error);
    }
});


// ================= LOGIN =================
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username=?";

    db.query(sql, [username], async (err, result) => {

        if (err) return res.status(500).json(err);

        if (result.length === 0) {
            return res.json({ message: "User Not Found" });
        }

        const valid = await bcrypt.compare(password, result[0].password);

        if (!valid) {
            return res.json({ message: "Wrong Password" });
        }

        res.json({ message: "Login Success" });
    });
});


// ================= PRODUCTS =================
app.post("/products", (req, res) => {

    const {
        productName,
        category,
        quantityInStock,
        unitPrice,
        supplierName,
        dateReceived
    } = req.body;

    const sql = `
    INSERT INTO product
    (productName, category, quantityInStock, unitPrice, supplierName, dateReceived)
    VALUES (?,?,?,?,?,?)
    `;

    db.query(sql,
        [productName, category, quantityInStock, unitPrice, supplierName, dateReceived],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({ message: "Product Created Successfully" });
        }
    );
});

app.get("/products", (req, res) => {

    db.query("SELECT * FROM product ORDER BY productCode DESC", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});


// ================= WAREHOUSE =================
app.post("/warehouse", (req, res) => {

    const { warehouseName, warehouseLocation } = req.body;

    const sql = `
    INSERT INTO warehouse (warehouseName, warehouseLocation)
    VALUES (?,?)
    `;

    db.query(sql, [warehouseName, warehouseLocation], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Warehouse Saved Successfully" });
    });
});

app.get("/warehouses", (req, res) => {

    db.query("SELECT * FROM warehouse ORDER BY warehouseCode DESC", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});


// ================= CONTROLLED TRANSACTIONS =================
app.post("/transactions", (req, res) => {

    const {
        productCode,
        warehouseCode,
        transactionDate,
        quantityMoved,
        transactionType
    } = req.body;

    const getProduct =
        "SELECT quantityInStock FROM product WHERE productCode=?";

    db.query(getProduct, [productCode], (err, result) => {

        if (err) return res.status(500).json(err);

        if (result.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        let stock = result[0].quantityInStock;

        // ================= RULES =================

        if (transactionType === "Stock In") {

            // You can only add if valid (your controlled rule)
            if (Number(quantityMoved) <= 0) {
                return res.status(400).json({
                    message: "Invalid Stock In quantity"
                });
            }

            stock = stock + Number(quantityMoved);
        }

        else if (transactionType === "Stock Out") {

            if (Number(quantityMoved) > stock) {
                return res.status(400).json({
                    message: `Not enough stock. Available: ${stock}`
                });
            }

            stock = stock - Number(quantityMoved);
        }

        // UPDATE PRODUCT STOCK
        const updateProduct =
            "UPDATE product SET quantityInStock=? WHERE productCode=?";

        db.query(updateProduct, [stock, productCode], (err2) => {

            if (err2) return res.status(500).json(err2);

            // INSERT TRANSACTION (LOG ONLY)
            const sql = `
            INSERT INTO stocktransaction
            (productCode, warehouseCode, transactionDate, quantityMoved, transactionType)
            VALUES (?,?,?,?,?)
            `;

            db.query(sql,
                [productCode, warehouseCode, transactionDate, quantityMoved, transactionType],
                (err3) => {

                    if (err3) return res.status(500).json(err3);

                    res.json({
                        message: "Transaction Successful",
                        remainingStock: stock
                    });
                }
            );
        });
    });
});


// ================= GET TRANSACTIONS =================
app.get("/transactions", (req, res) => {

    const sql = `
    SELECT
        t.transactionId,
        t.productCode,
        p.productName,
        t.warehouseCode,
        w.warehouseName,
        t.transactionDate,
        t.quantityMoved,
        t.transactionType
    FROM stocktransaction t
    JOIN product p ON t.productCode = p.productCode
    JOIN warehouse w ON t.warehouseCode = w.warehouseCode
    ORDER BY t.transactionId DESC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});


// ================= DASHBOARD =================
app.get("/dashboard", (req, res) => {

    const sql = `
    SELECT
    (SELECT COUNT(*) FROM product) AS products,
    (SELECT COUNT(*) FROM warehouse) AS warehouses,
    (SELECT COUNT(*) FROM stocktransaction WHERE transactionType='Stock In') AS stockin,
    (SELECT COUNT(*) FROM stocktransaction WHERE transactionType='Stock Out') AS stockout
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});


// ================= REPORTS =================
app.get("/report/daily", (req, res) => {
    db.query("SELECT * FROM stocktransaction WHERE DATE(transactionDate)=CURDATE()", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.get("/report/weekly", (req, res) => {
    db.query("SELECT * FROM stocktransaction WHERE YEARWEEK(transactionDate)=YEARWEEK(NOW())", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.get("/report/monthly", (req, res) => {
    db.query("SELECT * FROM stocktransaction WHERE MONTH(transactionDate)=MONTH(NOW()) AND YEAR(transactionDate)=YEAR(NOW())", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});


// ================= START SERVER =================
app.listen(5000, () => {
    console.log("Server Running On Port 5000");
});