import { useState } from "react";
import { 
  AiOutlineHome, 
  AiOutlineShopping, 
  AiOutlineShoppingCart,
  AiOutlineLogin,
  AiOutlineUserAdd
} from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "./FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 999 }}
      className={`fixed top-0 left-0 h-[100vh] bg-black text-white p-4 flex flex-col justify-between transition-all duration-300 group ${
        showSidebar || dropdownOpen ? "w-[15%]" : "w-[4%] hover:w-[15%]"
      }`}
      id="navigation-container"
    >
      {/* Top Links Section */}
      <div className="flex flex-col justify-center space-y-8 mt-[3rem]">
        <Link
          to="/"
          className="flex items-center space-x-2 transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome size={26} className="min-w-[26px]" />
          <span className="hidden group-hover:inline whitespace-nowrap">HOME</span>
        </Link>

        <Link
          to="/shop"
          className="flex items-center space-x-2 transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping size={26} className="min-w-[26px]" />
          <span className="hidden group-hover:inline whitespace-nowrap">SHOP</span>
        </Link>

        {/* CART LINK */}
        <Link
          to="/cart"
          className="flex items-center space-x-2 transition-transform transform hover:translate-x-2"
        >
          <div className="relative flex items-center">
            <AiOutlineShoppingCart size={26} className="min-w-[26px]" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs text-white bg-pink-500 rounded-full font-bold leading-none">
                {cartItems.reduce((a, c) => a + Number(c.qty), 0)}
              </span>
            )}
          </div>
          <span className="hidden group-hover:inline whitespace-nowrap">
            CART
          </span>
        </Link>

        {/* FAVORITES LINK */}
        <Link
          to="/favorite"
          className="flex items-center space-x-2 transition-transform transform hover:translate-x-2"
        >
          <div className="relative flex items-center">
            <FaHeart size={26} className="min-w-[26px]" />
            <FavoritesCount />
          </div>
          <span className="hidden group-hover:inline whitespace-nowrap">
            FAVORITE
          </span>
        </Link>
      </div>

      {/* Profile / Dropdown Section */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-300 focus:outline-none"
        >
          {userInfo ? <span className="text-white">{userInfo.username}</span> : null}

          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            style={{ zIndex: 1000 }}
            className="absolute right-0 bottom-full mb-2 w-40 bg-white text-gray-600 rounded shadow-lg"
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/admin/categorylist" className="block px-4 py-2 hover:bg-gray-100">
                    Category
                  </Link>
                </li>
                <li>
                  <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-100">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-100">
                    Users
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Auth Links (If logged out) */}
      {!userInfo && (
        <ul className="space-y-2 mb-4">
          <li>
            <Link
              to="/login"
              className="flex items-center space-x-2 transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin size={26} className="min-w-[26px]" />
              <span className="hidden group-hover:inline whitespace-nowrap">
                LOGIN
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center space-x-2 transition-transform transform hover:translate-x-2"
            >
              <AiOutlineUserAdd size={26} className="min-w-[26px]" />
              <span className="hidden group-hover:inline whitespace-nowrap">
                REGISTER
              </span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;