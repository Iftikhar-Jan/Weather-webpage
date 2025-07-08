import React from "react";
import HeroSection from "./components/HeroSection";

// import "./App.css";


function App() {
  const fetchWeather = async (city) => {
    try {
    
      const res = await fetch(`http://localhost:5000/api/weather?city=${city}`);

      const data = await res.json();
      if (data.error) {
        alert("City not found");
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error fetching weather:", error);
      return null;
    }
  };

  return (
    <div>
      <HeroSection onSearch={fetchWeather} />
    </div>
  );
}

export default App;
