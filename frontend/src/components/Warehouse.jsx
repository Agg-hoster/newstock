import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Warehouse() {

    const [warehouse, setWarehouse] = useState({
        warehouseName: "",
        warehouseLocation: ""
    });

    const handleChange = (e) => {
        setWarehouse({
            ...warehouse,
            [e.target.name]: e.target.value
        });
    };

    const saveWarehouse = async (e) => {
        e.preventDefault();

        const res = await axios.post(
            "http://localhost:5000/warehouse",
            warehouse
        );

        alert(res.data.message);

        setWarehouse({
            warehouseName: "",
            warehouseLocation: ""
        });
    };

    return (
        <>
            <Navbar />

            <div className="flex">
                <Sidebar />

                <div className="flex-1 p-8 bg-gray-100 min-h-screen">

                    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">

                        <h1 className="text-2xl font-bold mb-6 text-center">
                            Warehouse Registration
                        </h1>

                        <form onSubmit={saveWarehouse}>

                            <div className="mb-4">
                                <label className="block mb-1">
                                    Warehouse Name
                                </label>

                                <input
                                    type="text"
                                    name="warehouseName"
                                    value={warehouse.warehouseName}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-1">
                                    Warehouse Location
                                </label>

                                <input
                                    type="text"
                                    name="warehouseLocation"
                                    value={warehouse.warehouseLocation}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded"
                                    required
                                />
                            </div>

                            <button
                                className="bg-green-600 text-white px-6 py-2 rounded"
                            >
                                Save Warehouse
                            </button>

                        </form>

                    </div>

                </div>
            </div>
        </>
    );
}

export default Warehouse;