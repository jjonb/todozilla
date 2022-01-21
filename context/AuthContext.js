import React, { useEffect, useState, useContext } from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const auth = getAuth();
  const [userID, setUserID] = useState("");

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for authentication state to change.
    return onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUserID(user.uid);
      } else {
        setUserID("");
      }
    });
  }, []);

  const dispatchUserEvent = (action, payload) => {
    switch (action) {
      case "REGISTER":
        setLoading(true);
        createUserWithEmailAndPassword(auth, payload.email, payload.password)
          .then((data) => {
            const db = getDatabase();
            const reference = ref(db, "scores/" + data.user.uid);
            set(reference, {
              name: payload.name,
              currentScore: 0,
            });
            setLoading(false);
          })
          .catch((err) => setLoading(false));
        break;
      case "LOGIN":
        setLoading(true);
        signInWithEmailAndPassword(auth, payload.email, payload.password)
          .then((data) => setLoading(false))
          .catch((err) => setLoading(false));
        break;
      default:
        break;
    }
  };

  return (
    <AuthContext.Provider
      value={{ userID, auth, dispatchUserEvent, isLoading, setLoading }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
