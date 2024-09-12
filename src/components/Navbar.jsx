import React, { useCallback, useEffect, useState } from "react";
import { GiCampingTent } from "react-icons/gi";
import { navMenus } from "../utils/data";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ menuIdx }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.authData);
  const { name } = user || {};
  const googleClientId = process.env.REACT_APP_AUTH_CLIENT_ID;
  const [isAuth, setIsAuth] = useState(false);

  const handleLoginSucess = useCallback((response) => {
    const decoded = jwtDecode(response.credential);
    dispatch(login({ authData: decoded }));
    setIsAuth(true);
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("authData"));
    if (storedData) {
      dispatch(login({ authData: storedData }));
      setIsAuth(true);
    }
  }, [dispatch]);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleLoginSucess,
      });
    } else {
      console.log("Google object is not available");
    }
  }, [googleClientId, handleLoginSucess]);

  const handleLoginClick = () => {
    window.google.accounts.id.prompt();
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("authData");
    dispatch(logout());
    setIsAuth(false);
  };

  return (
    <nav className="bg-white xl:w-[10%] md:w-[20%] w-full h-[100%] flex flex-col justify-between border border-gray-200 px-2 overflow-hidden">
      <div className="menubar-wrapper flex justify-normal">
        <ul className="flex flex-col gap-y-3 text-md font-semibold mt-14">
          {navMenus.map((menu, idx) => (
            <li
              key={idx}
              className={`${
                menu.idx === menuIdx ? "bg-white" : ""
              } px-5 py-2 bg-white
               hover:bg-cyan-100 rounded-md`}
              style={{ minWidth: "160px" }}
            >
              <Link to={menu.to} className="flex gap-x-4 items-center">
                {menu.icon}
                {menu.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <nav className="bg-white dark:bg-gray-900 fixed w-full h-[50px] z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="header-wrapper flex gap-x-2 items-center ml-5">
          <GiCampingTent className="w-10 h-10 mt-1 text-cyan-400" />
          <span
            className="text-xl font-bold bg-gradient-to-r
         "
          >
            <Link
              to={"/"}
              className="test2 text-md text-cyan-400 drop-shadow-sm"
            >
              Camping Guide
            </Link>
          </span>
          {/* <FaTree className="w-8 h-8" /> */}
        </div>
      </nav>

      <div className="login-wrapper">
        {isAuth ? (
          <button
            onClick={handleLogoutClick}
            className="flex justify-center items-center gap-2
           bg-white text-black py-2 px-4 mb-4 rounded-md font-semibold border border-gray-200"
          >
            <FcGoogle className="h-5 w-5" />
            {name}님 Logout
          </button>
        ) : (
          <button
            onClick={handleLoginClick}
            className="flex justify-center items-center gap-2
           bg-white text-black py-2 px-4 rounded-md font-semibold"
          >
            <FcGoogle className="h-5 w-5" />
            Login With Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
