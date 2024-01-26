import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useAuth } from "./context/AuthProvider";

export const Landing = () => {
  const { value, dispatch } = useAuth();
  const [cookies, setCookie] = useCookies(["token"]);

  useEffect(() => {
    console.log("Checking for stored token...");
    const storedToken = cookies.token;
  
    console.log("Stored token:", storedToken);
  
    if (storedToken && storedToken.trim() !== "") {
      console.log("Stored token found. Updating context.");
      dispatch({ type: "SET_TOKEN", payload: storedToken });
    } else {
      console.log("Stored token is empty or undefined. Not updating context.");
    }
  }, [cookies.token, dispatch]);

  const handleLogout = () => {
    // Clear the token from cookies and update context
    setCookie("token", "", { path: "/", expires: new Date(0) });
    dispatch({ type: "LOGOUT" });
  };

  return (
    <>
      <h2>Landing (Protected)</h2>
      {value.token ? (
        <>
          <div>Authenticated as {value.token}</div>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <div>Not authenticated</div>
      )}
    </>
  );
};
