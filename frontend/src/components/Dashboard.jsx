import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Dashboard() {

    const [stats, setStats] = useState({});

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        const res = await axios.get(
            "http://localhost:5000/dashboard"
        );

        setStats(res.data);
    };

    return (
        <>
            <Navbar />

            <div className="flex">

                <Sidebar />

                <div className="flex-1 p-6 bg-gray-100 min-h-screen">

                    <h1 className="text-3xl font-bold mb-6">
                        Dashboard
                    </h1>

                    <div className="grid md:grid-cols-4 gap-6">

                        <div className="bg-blue-600 text-white p-6 rounded shadow">

                            <h2>Total Products</h2>

                            <p className="text-3xl font-bold">
                                {stats.products}
                            </p>

                        </div>

                        <div className="bg-green-600 text-white p-6 rounded shadow">

                            <h2>Warehouses</h2>

                            <p className="text-3xl font-bold">
                                {stats.warehouses}
                            </p>

                        </div>

                        <div className="bg-yellow-500 text-white p-6 rounded shadow">

                            <h2>Stock In</h2>

                            <p className="text-3xl font-bold">
                                {stats.stockin}
                            </p>

                        </div>

                        <div className="bg-red-600 text-white p-6 rounded shadow">

                            <h2>Stock Out</h2>

                            <p className="text-3xl font-bold">
                                {stats.stockout}
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Dashboard;