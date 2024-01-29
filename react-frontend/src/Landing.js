import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useAuth } from "./context/AuthProvider";
import axios from "axios";

export const Landing = () => {
  const { value, dispatch } = useAuth();
  const [cookies, setCookie] = useCookies(["token"]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Check for the stored token
    const storedToken = cookies.token;

    if (storedToken && storedToken.trim() !== "") {
      // Update the context with the stored token
      dispatch({ type: "SET_TOKEN", payload: storedToken });

      // Fetch contacts using the token
      fetchContacts(storedToken);
    }
  }, [cookies.token, dispatch]);

  const handleLogout = () => {
    // Clear the token from cookies and update context
    setCookie("token", "", { path: "/", expires: new Date(0) });
    dispatch({ type: "LOGOUT" });
  };

  const fetchContacts = async (token) => {
    try {
      const response = await axios.get("https://localhost:8000/api/contacts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Update the contacts state with the fetched data
        setContacts(response.data.contacts);
      } else {
        console.error("Error fetching contacts:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  return (
    <>
      <h2>Landing (Protected)</h2>
      {value.token ? (
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
