import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Reports() {

    const [report, setReport] = useState([]);

    const dailyReport = async () => {

        const res = await axios.get(
            "http://localhost:5000/report/daily"
        );

        setReport(res.data);
    };

    const weeklyReport = async () => {

        const res = await axios.get(
            "http://localhost:5000/report/weekly"
        );

        setReport(res.data);
    };

    const monthlyReport = async () => {

        const res = await axios.get(
            "http://localhost:5000/report/monthly"
        );

        setReport(res.data);
    };

    return (
        <>
            <Navbar />

            <div className="flex">

                <Sidebar />

                <div className="flex-1 p-6">

                    <h1 className="text-3xl font-bold mb-4">
                        Reports
                    </h1>

                    <div className="space-x-4 mb-5">

                        <button
                            onClick={dailyReport}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Daily Report
                        </button>

                        <button
                            onClick={weeklyReport}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Weekly Report
                        </button>

                        <button
                            onClick={monthlyReport}
                            className="bg-purple-600 text-white px-4 py-2 rounded"
                        >
                            Monthly Report
                        </button>

                    </div>

                    <table className="w-full border">

                        <thead>

                            <tr className="bg-gray-200">

                                <th>ID</th>
                                <th>Date</th>
                                <th>Quantity</th>
                                <th>Type</th>

                            </tr>

                        </thead>

                        <tbody>

                            {report.map((item) => (

                                <tr key={item.transactionId}>

                                    <td>{item.transactionId}</td>
                                    <td>{item.transactionDate}</td>
                                    <td>{item.quantityMoved}</td>
                                    <td>{item.transactionType}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>
        </>
    );
}

export default Reports;