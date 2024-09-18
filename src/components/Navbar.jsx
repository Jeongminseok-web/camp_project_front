import React, { useCallback, useEffect, useState } from "react";
import { GiCampingTent } from "react-icons/gi";
import { navMenus } from "../utils/data";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaTree } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Navbar = ({ menuIdx }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.authData);
  const { name } = user || {};
  const googleClientId = process.env.REACT_APP_AUTH_CLIENT_ID;
  console.log(googleClientId);
  const [isAuth, setIsAuth] = useState(false);

  const handleLoginSuccess = useCallback(
    (credentialResponse) => {
      try {
        const decoded = jwtDecode(credentialResponse.credential); // 'credential'에서 JWT 토큰 추출
        dispatch(login({ authData: decoded }));
        setIsAuth(true);
        // console.log('Sign in success', credentialResponse);
      } catch (error) {
        console.error("Login success handling error", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("authData"));
    if (storedData) {
      dispatch(login({ authData: storedData }));
      setIsAuth(true);
    }
  }, [dispatch]);

  const handleLoginError = (error) => {
    console.log("Google login error", error);
  };

  const handleLogoutClick = () => {
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
          <div className="w-4/5 flex flex-center">
            <button
              onClick={handleLogoutClick}
              className="font-customFontEn flex justify-center items-center gap-2 bg-white text-gray-900 py-3 px-4 rounded-md w-full"
            >
              <FcGoogle className="h-5 w-5" />
              <span className="text-sm">{name}님 Logout</span>
            </button>
          </div>
        ) : (
          <div className="w-4/5 flex flex-center login-btn">
            <GoogleOAuthProvider clientId={googleClientId}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
              <button className="font-customFontEn flex justify-center items-center gap-2 bg-white text-gray-900 py-3 px-4 rounded-md w-full">
                <FcGoogle className="h-5 w-5" />
                <span className="text-sm">Google Login</span>
              </button>
            </GoogleOAuthProvider>
            {/* <button onClick={() => handleGoogleLogin()}>Login with Google</button> */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
