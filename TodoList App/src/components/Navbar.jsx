import React from "react";

const Navbar = () => {
  return (
    <nav className="nav-container bg-[#1c9e97] p-2 flex justify-between">
      <div className="logo mx-2">
        <span className="font-bold text-lg text-white">Daily~Do</span>
      </div>
      <ul className="flex gap-8 text-slate-300 transition-all duration-[1s] ">
        <li className="cursor-pointer hover:text-slate-50 hover:font-semibold">
          Home
        </li>
        <li className="cursor-pointer hover:text-slate-50 hover:font-semibold">
          Your Todos
        </li>
        <li className="cursor-pointer hover:text-slate-50 hover:font-semibold">
          Routine
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
