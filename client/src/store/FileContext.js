import React, { createContext, useContext, useState } from "react";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [selectedFileName, setSelectedFileName] = useState({ name: "", url: "" });

  return (
    <FileContext.Provider value={{ selectedFileName, setSelectedFileName }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => useContext(FileContext);
