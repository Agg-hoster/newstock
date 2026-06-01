import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Product() {

    const [products, setProducts] = useState([]);

    const [form, setForm] = useState({
        productName: "",
        category: "",
        quantityInStock: "",
        unitPrice: "",
        supplierName: "",
        dateReceived: ""
    });

    const [editId, setEditId] = useState(null);

    // LOAD PRODUCTS
    const loadProducts = async () => {
        const res = await axios.get("http://localhost:5000/products");
        setProducts(res.data);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // HANDLE INPUT
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // SUBMIT (CREATE + UPDATE)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editId) {

            await axios.put(
                `http://localhost:5000/products/${editId}`,
                form
            );

            alert("Product Updated");

        } else {

            await axios.post(
                "http://localhost:5000/products",
                form
            );

            alert("Product Saved");
        }

        setForm({
            productName: "",
            category: "",
            quantityInStock: "",
            unitPrice: "",
            supplierName: "",
            dateReceived: ""
        });

        setEditId(null);
        loadProducts();
    };

    // EDIT
    const handleEdit = (item) => {
        setEditId(item.productCode);
        setForm(item);
    };

    // DELETE
    const handleDelete = async (id) => {

        if (!window.confirm("Delete this product?")) return;

        await axios.delete(
            `http://localhost:5000/products/${id}`
        );

        alert("Deleted");
        loadProducts();
    };

    return (
        <>
            <Navbar />

            <div className="flex">

                <Sidebar />

                <div className="flex-1 p-6 bg-gray-100 min-h-screen">

                    {/* FORM */}
                    <div className="bg-white p-6 rounded shadow mb-6">

                        <h2 className="text-xl font-bold mb-4">
                            Product Form
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="grid md:grid-cols-2 gap-4"
                        >

                            <input
                                name="productName"
                                value={form.productName}
                                onChange={handleChange}
                                placeholder="Product Name"
                                className="border p-2"
                            />

                            <input
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                placeholder="Category"
                                className="border p-2"
                            />

                            <input
                                type="number"
                                name="quantityInStock"
                                value={form.quantityInStock}
                                onChange={handleChange}
                                placeholder="Quantity"
                                className="border p-2"
                            />

                            <input
                                type="number"
                                name="unitPrice"
                                value={form.unitPrice}
                                onChange={handleChange}
                                placeholder="Unit Price"
                                className="border p-2"
                            />

                            <input
                                name="supplierName"
                                value={form.supplierName}
                                onChange={handleChange}
                                placeholder="Supplier"
                                className="border p-2"
                            />

                            <input
                                type="date"
                                name="dateReceived"
                                value={form.dateReceived}
                                onChange={handleChange}
                                className="border p-2"
                            />

                            <button className="bg-blue-600 text-white p-2 col-span-2">
                                {editId ? "Update Product" : "Save Product"}
                            </button>

                        </form>

                    </div>

                    {/* TABLE */}
                    <div className="bg-white p-6 rounded shadow">

                        <table className="w-full border">

                            <thead>
                                <tr className="bg-gray-200">
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Supplier</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.productCode}>

                                        <td>{p.productName}</td>
                                        <td>{p.category}</td>
                                        <td>{p.quantityInStock}</td>
                                        <td>{p.unitPrice}</td>
                                        <td>{p.supplierName}</td>

                                        <td>
                                            <button
                                                onClick={() => handleEdit(p)}
                                                className="bg-yellow-500 px-2 py-1 mr-2 text-white"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(p.productCode)}
                                                className="bg-red-600 px-2 py-1 text-white"
                                            >
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

export default Product;