import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {

  return (

    <div className="bg-gray-900 text-white w-64 min-h-screen">

      <h2 className="text-center text-xl py-4">
        SMS Menu
      </h2>

      <ul>

        <li>
          <Link
            to="/dashboard"
            className="block p-3 hover:bg-gray-700"
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            to="/product"
            className="block p-3 hover:bg-gray-700"
          >
            Product
          </Link>
        </li>

        <li>
          <Link
            to="/warehouse"
            className="block p-3 hover:bg-gray-700"
          >
            Warehouse
          </Link>
        </li>

        <li>
          <Link
            to="/transaction"
            className="block p-3 hover:bg-gray-700"
          >
            Transactions
          </Link>
        </li>

        <li>
          <Link
            to="/reports"
            className="block p-3 hover:bg-gray-700"
          >
            Reports
          </Link>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;