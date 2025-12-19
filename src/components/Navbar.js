import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUserCircle, 
  FaCaretDown, 
  FaBook, 
  FaGift, 
  FaLanguage, 
  FaImages 
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("loggedInUser");

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">मनZil</Link>
      </div>

      <ul className="nav-left">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/flights">Flights</Link></li>
        <li><Link to="/hotels">Hotels</Link></li>
        <li><Link to="/explorer">Explorer</Link></li>
        <li><Link to="/itinerary">Itinerary</Link></li>
        <li><Link to="/packing">Packing List</Link></li>

        {/* ➤ NEW TOOLS DROPDOWN */}
        <li className="dropdown">
          <span className="dropdown-title">
            Tools <FaCaretDown size={12} style={{ marginLeft: "4px" }} />
          </span>
          
          <ul className="dropdown-menu">
            <li>
              <Link to="/travel-diary">
                <FaBook className="dd-icon" /> Travel Diary
              </Link>
            </li>
            <li>
              <Link to="/rewards">
                <FaGift className="dd-icon" /> Rewards
              </Link>
            </li>
            <li>
              <Link to="/translator">
                <FaLanguage className="dd-icon" /> Translator
              </Link>
            </li>
            <li>
              <Link to="/memory-album">
                <FaImages className="dd-icon" /> Memory Album
              </Link>
            </li>
          </ul>
        </li>

      </ul>

      <ul className="nav-right">
        {/* 🟡 Manzil Miles Badge */}
        <li>
          <div className="manzil-miles">
            🏅 <span></span> Manzil Miles
          </div>
        </li>

        {loggedInUser ? (
          <>
            <li className="user-info">
              <FaUserCircle size={22} /> <span>{loggedInUser}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="btn-login">Login</Link></li>
            <li><Link to="/signup" className="btn-signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;