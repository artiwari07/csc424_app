import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useAuth } from "./context/AuthProvider";
import axios from "axios";

const TOKEN_KEY = "JWT_AUTH_TOKEN";
const INVALID_TOKEN = "INVALID_TOKEN";
const queryParameters = new URLSearchParams(window.location.search);
const google_token = queryParameters.get("token");
console.log("Landing google token", google_token);
export const Landing = () => {
  const { value, dispatch } = useAuth();
  const [cookies, setCookie] = useCookies(["token"]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const handleToken = (token) => {
      if (token) {
        // Update the context with the token
        dispatch({ type: "SET_GOOGLE_TOKEN", payload: token });
  
        // Store the token in cookies
        setCookie("token", token, { path: "/" });
      }
    };
    const handleGoogleLogin = async (googleToken) => {
      try {
        // Store the Google token in local storage
        localStorage.setItem(TOKEN_KEY, googleToken);
        // Use dispatch to set the Google token in the context
        dispatch({ type: "SET_GOOGLE_TOKEN", payload: googleToken });
        console.log("Google login successful");
        console.log("After navigation");
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get('token');
    if (googleToken) {
        handleGoogleLogin(googleToken);
      }
    
  
    // Check for the stored token
    const storedToken = cookies.token;
    const tokenFromLocalStorage = localStorage.getItem(TOKEN_KEY);
  
    if ((storedToken && storedToken.trim() !== "") || (tokenFromLocalStorage && tokenFromLocalStorage !== INVALID_TOKEN)) {
      // Update the context with the stored token
      dispatch({ type: "SET_TOKEN", payload: storedToken });
      console.log("storedToken:", storedToken);
      console.log("tokenFromLocalStorage:", tokenFromLocalStorage);
      // Fetch contacts using the stored token
      fetchContacts(storedToken);
    } else {
      // If the token is invalid or not present, navigate to the home page
      window.location.href = "/home";
    }
  
    // Retrieve the Google token from the URL
    const queryParameters = new URLSearchParams(window.location.search);
    const google_token = queryParameters.get("token");
  
    // Handle Google token
    handleToken(google_token);
  
  }, [cookies.token, dispatch, setCookie]);
  

  const handleLogout = () => {
    // Clear the token from cookies and update context
    setCookie("token", "", { path: "/", expires: new Date(0) });
    dispatch({ type: "LOGOUT" });
  };

  const fetchContacts = async () => {
    const tokenToUse = value.token || cookies.token;
    console.log("tokenToUse:", tokenToUse);
    try {
      if (tokenToUse) {
        const response = await axios.get("https://localhost:8000/api/contacts", {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
          },
        });
  
        if (response.data.success) {
          // Update the contacts state with the fetched data
          setContacts(response.data.contacts);
        } else {
          console.error("Error fetching contacts:", response.data.error);
        }
      } else {
        // Handle the case where the token is missing or invalid
        console.error("Token is missing or invalid");
        // You might want to redirect the user or handle this case as per your application's requirements
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      // Handle other errors as needed
    }
  };
  

  return (
    <>
      <h2>Landing (Protected)</h2>
      {(value.token || cookies.token) ? (
      <>
          {/* <button onClick={handleLogout}>Logout</button> */}

          <div>
            <h3>List of Users</h3>
            <ul>
              {contacts.map((contact) => (
                <li key={contact._id}>{contact.username}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div>Not authenticated</div>
      )}
    </>
  );
};
