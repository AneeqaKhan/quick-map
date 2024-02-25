import React from "react";

const AppButton = ({ handleClick, children }) => {
  return (
    <button onClick={handleClick} className="app-button">
      {children}
    </button>
  );
};

export default AppButton