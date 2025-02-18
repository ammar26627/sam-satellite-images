import React, { useContext } from "react";
import AppContext from "./hooks/createContext";

const Stage = () => {
  const { image: [image], maskImg: [maskImg] } = useContext(AppContext);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {image && <img src={image.src} alt="Input" style={{ width: "100%" }} />}
      {maskImg && (
        <img
          src={maskImg}
          alt="Generated Mask"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            mixBlendMode: "multiply",
          }}
        />
      )}
    </div>
  );
};

export default Stage;
