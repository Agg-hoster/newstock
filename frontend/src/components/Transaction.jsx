import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Transaction() {

    const [formData, setFormData] = useState({
        productCode: "",
        warehouseCode: "",
        transactionDate: "",
        quantityMoved: "",
        transactionType: ""
    });

    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [editId, setEditId] = useState(null);
    const [availableStock, setAvailableStock] = useState(0);

    useEffect(() => {
        loadTransactions();
        loadProducts();
        loadWarehouses();
    }, []);

    // ================= LOAD DATA =================
    const loadTransactions = async () => {
        const res = await axios.get("http://localhost:5000/transactions");
        setTransactions(res.data);
    };

    const loadProducts = async () => {
        const res = await axios.get("http://localhost:5000/products");
        setProducts(res.data);
    };

    const loadWarehouses = async () => {
        const res = await axios.get("http://localhost:5000/warehouses");
        setWarehouses(res.data);
    };

    // 🔥 FIX 1: Always refresh products after transaction
    const refreshAll = async () => {
        await loadTransactions();
        await loadProducts(); // IMPORTANT FIX
    };

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        if (name === "productCode") {

            const selected = products.find(
                (p) => p.productCode == value
            );

            setAvailableStock(selected ? selected.quantityInStock : 0);
        }
    };

    // ================= RESET =================
    const resetForm = () => {
        setFormData({
            productCode: "",
            warehouseCode: "",
            transactionDate: "",
            quantityMoved: "",
            transactionType: ""
        });

        setEditId(null);
        setAvailableStock(0);
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {

        e.preventDefault();

        // 🔥 FRONTEND VALIDATION (kept but not trusted)
        if (
            formData.transactionType === "Stock Out" &&
            Number(formData.quantityMoved) > Number(availableStock)
        ) {
            alert(`❌ Insufficient Stock! Available: ${availableStock}`);
            return;
        }

        try {

            if (editId) {

                await axios.put(
                    `http://localhost:5000/transactions/${editId}`,
                    formData
                );

                alert("Transaction Updated");

            } else {

                await axios.post(
                    "http://localhost:5000/transactions",
                    formData
                );

                alert("Transaction Saved");
            }

            // 🔥 FIX 2: refresh everything after save
            await refreshAll();

            resetForm();

        } catch (error) {

            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                console.log(error);
            }
        }
    };

    // ================= DELETE =================
    const deleteTransaction = async (id) => {

        if (!window.confirm("Delete this transaction?")) return;

        await axios.delete(`http://localhost:5000/transactions/${id}`);

        alert("Deleted Successfully");

        await refreshAll(); // 🔥 FIX
    };

    // ================= EDIT =================
    const editTransaction = (item) => {

        setEditId(item.transactionId);

        setFormData({
            productCode: item.productCode,
            warehouseCode: item.warehouseCode,
            transactionDate: item.transactionDate?.split("T")[0],
            quantityMoved: item.quantityMoved,
            transactionType: item.transactionType
        });

        const selected = products.find(
            (p) => p.productCode == item.productCode
        );

        setAvailableStock(selected ? selected.quantityInStock : 0);
    };

    // ================= UI =================
    return (
        <>
            <Navbar />
            <div className="flex">
                <Sidebar />

                <div className="flex-1 p-6 bg-gray-100 min-h-screen">

                    {/* FORM */}
                    <div className="bg-white p-6 rounded shadow mb-6">

                        <h2 className="text-2xl font-bold mb-4">
                            Stock Transaction
                        </h2>

                        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

                            {/* PRODUCT */}
                            <div>
                                <label>Product</label>

                                <select
                                    name="productCode"
                                    value={formData.productCode}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    required
                                >
                                    <option value="">Select Product</option>

                                    {products.map((p) => (
                                        <option key={p.productCode} value={p.productCode}>
                                            {p.productName}
                                        </option>
                                    ))}
                                </select>

                                {formData.productCode && (
                                    <p className="text-green-600 mt-1">
                                        Available Stock: {availableStock}
                                    </p>
                                )}
                            </div>

                            {/* WAREHOUSE */}
                            <div>
                                <label>Warehouse</label>

                                <select
                                    name="warehouseCode"
                                    value={formData.warehouseCode}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    required
                                >
                                    <option value="">Select Warehouse</option>

                                    {warehouses.map((w) => (
                                        <option key={w.warehouseCode} value={w.warehouseCode}>
                                            {w.warehouseName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* DATE */}
                            <div>
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="transactionDate"
                                    value={formData.transactionDate}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    required
                                />
                            </div>

                            {/* QUANTITY */}
                            <div>
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    name="quantityMoved"
                                    value={formData.quantityMoved}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    required
                                />
                            </div>

                            {/* TYPE */}
                            <div>
                                <label>Type</label>

                                <select
                                    name="transactionType"
                                    value={formData.transactionType}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="Stock In">Stock In</option>
                                    <option value="Stock Out">Stock Out</option>
                                </select>
                            </div>

                            {/* BUTTONS */}
                            <div className="flex items-end gap-2">

                                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                                    {editId ? "Update" : "Save"}
                                </button>

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Clear
                                </button>

                            </div>

                        </form>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white p-6 rounded shadow">

                        <h2 className="text-xl font-bold mb-4">
                            Transactions
                        </h2>

                        <table className="w-full border">

                            <thead>
                                <tr className="bg-blue-700 text-white">
                                    <th>ID</th>
                                    <th>Product</th>
                                    <th>Warehouse</th>
                                    <th>Date</th>
                                    <th>Qty</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.transactionId}>
                                        <td>{t.transactionId}</td>
                                        <td>{t.productName}</td>
                                        <td>{t.warehouseName}</td>
                                        <td>{t.transactionDate}</td>
                                        <td>{t.quantityMoved}</td>
                                        <td>{t.transactionType}</td>
                                        <td>
                                            <button onClick={() => editTransaction(t)} className="bg-yellow-500 px-2 mr-2">
                                                Edit
                                            </button>

                                            <button onClick={() => deleteTransaction(t.transactionId)} className="bg-red-600 text-white px-2">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>

                </div>
            </div>
        </>
    );
}

export default Transaction;