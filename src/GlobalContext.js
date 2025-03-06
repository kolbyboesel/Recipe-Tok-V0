import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("Seafood");

    return (
        <GlobalContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);