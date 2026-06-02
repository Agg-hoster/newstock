import React from "react";

function Navbar() {

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <div className="bg-blue-700 text-white p-4 flex justify-between">

      <h1 className="font-bold text-xl">
        Stock Management System
      </h1>

      <button
        className="bg-red-600 px-4 py-2 rounded"
        onClick={logout}
      >
        Logout
      </button>

    </div>
  );
}

export default Navbar;