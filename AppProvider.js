import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default function AppProvider({
  children,
  initialSessionToken,
  initialRole,
  initialId,
  initialName,
  initialFullname,
}) {
  const [id, setId] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [fullname, setFullname] = useState(null);

  useEffect(() => {
    (async () => {
      const storedId = await AsyncStorage.getItem("id");
      const storedRole = await AsyncStorage.getItem("role");
      const storedName = await AsyncStorage.getItem("name");
      const storedToken = await AsyncStorage.getItem("accessToken");
      const storedFullname = await AsyncStorage.getItem("fullname");

      setId(initialId || storedId);
      setRole(initialRole || storedRole);
      setName(initialName || storedName);
      setSessionToken(initialSessionToken || storedToken || "");
      setFullname(initialFullname || storedFullname);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (sessionToken && role) {
        await AsyncStorage.setItem("role", role);
        await AsyncStorage.setItem("accessToken", sessionToken);
        await AsyncStorage.setItem("id", id);
        await AsyncStorage.setItem("name", name);
        await AsyncStorage.setItem("fullname", fullname);
      } else {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("role");
        await AsyncStorage.removeItem("id");
        await AsyncStorage.removeItem("name");
        await AsyncStorage.removeItem("fullname");
      }
    })();
  }, [sessionToken, role, id, name, fullname]);

  return (
    <AppContext.Provider
      value={{
        sessionToken,
        setSessionToken,
        role,
        setRole,
        id,
        setId,
        name,
        setName,
        fullname,
        setFullname,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node,
  initialSessionToken: PropTypes.string,
  initialRole: PropTypes.string,
  initialId: PropTypes.string,
  initialName: PropTypes.string,
  initialFullname: PropTypes.string,
};
