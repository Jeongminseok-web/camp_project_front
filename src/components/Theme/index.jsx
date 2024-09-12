// index.jsx
import React, { useState } from "react";
import Navbar from "../Navbar";
import ThemePanel from "./ThemePanel";

const Index = () => {
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  return (
    <div className="w-[100%] h-[98vh] m-auto flex overflow-auto">
      <Navbar />

      <div className="w-[100%] flex flex-col">
        <ThemePanel
          selectedTheme={selectedTheme}
          onSelectTheme={handleThemeSelect}
        />
      </div>
    </div>
  );
};

export default Index;
