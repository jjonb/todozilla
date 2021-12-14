import React, { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

export const AuthContext = React.createContext();

export const AuthProvider = (props) => {
  const auth = getAuth();
  const [userID, setUserID] = useState("");

  useEffect(() => {
    // Listen for authentication state to change.
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUserID(user.uid);
      } else {
        setUserID("");
      }
    });
    return () => {};
  }, []);

  const dispatchUserEvent = (action, payload) => {
    switch (action) {
      case "REGISTER":
        createUserWithEmailAndPassword(auth, payload.email, payload.password);
        break;
      case "LOGIN":
        signInWithEmailAndPassword(auth, payload.email, payload.password);
        break;
      default:
        break;
    }
  };

  return (
    <AuthContext.Provider value={{ userID, auth, dispatchUserEvent }}>
      {props.children}
    </AuthContext.Provider>
  );
};
