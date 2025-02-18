import { createContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const imageState = useState(null);
  const maskImgState = useState(null);

  return (
    <AppContext.Provider value={{ image: imageState, maskImg: maskImgState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
