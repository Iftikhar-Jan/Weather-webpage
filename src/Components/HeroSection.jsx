import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
} from "react-icons/wi";

const iconMap = {
  sunny: <WiDaySunny />,
  cloudy: <WiCloudy />,
  rain: <WiRain />,
  thunder: <WiThunderstorm />,
  snow: <WiSnow />,
  fog: <WiFog />,
};

const fetchWeather = async (city) => {
  const response = await axios.fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=0f7c6ef6c6607081001a77624225f5d7`
  );
}
const HeroSection = ({ onSearch }) => {

const{data:weather,isloading,iserror} = useQuery({
  queryKey: ["weather"],
  queryFn: () => fetchWeather("London"),
  refetchInterval: 60000, 
});

  console.log("Weather Data:", weather);
  

if (isloading) return <div>Loading...</div>;
if (iserror) return <div>Error fetching weather data</div>;



  const [city, setCity] = useState("");
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualMode, setManualMode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (city.trim() === "") return;

    const data = await onSearch(city);
    if (data) {
      setSelectedWeather(data);
      setIsModalOpen(true);
    }
    setCity("");
  };

  const handleCardClick = (card) => {
    setSelectedWeather(card);
    setIsModalOpen(true);
  };

  const getBackgroundClass = () => {
    if (manualMode === "day") return "bg-gradient-to-b from-sky-300 to-sky-600";
    if (manualMode === "night")
      return "bg-gradient-to-b from-gray-900 to-black";

    if (selectedWeather) {
      switch (selectedWeather.iconKey) {
        case "sunny":
          return "bg-gradient-to-b from-yellow-300 to-yellow-600";
        case "cloudy":
          return "bg-gradient-to-b from-gray-400 to-gray-700";
        case "rain":
          return "bg-gradient-to-b from-blue-800 to-gray-600";
        case "thunder":
          return "bg-gradient-to-b from-purple-900 to-gray-800";
        case "snow":
          return "bg-gradient-to-b from-blue-200 to-white";
        case "fog":
          return "bg-gradient-to-b from-gray-300 to-gray-500";
        default:
          return "bg-gradient-to-b from-blue-900 to-blue-500";
      }
    } else {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12)
        return "bg-gradient-to-b from-sky-300 to-sky-600";
      if (hour >= 12 && hour < 18)
        return "bg-gradient-to-b from-blue-400 to-indigo-600";
      return "bg-gradient-to-b from-gray-900 to-black";
    }
  };
  

  const weatherCards = [
    { iconKey: "sunny", city: "India", temp: "32°C", desc: "Sunny" },
    { iconKey: "cloudy", city: "United State", temp: "25°C", desc: "Cloudy" },
    { iconKey: "rain", city: "UAE", temp: "28°C", desc: "Rain" },
    {
      iconKey: "thunder",
      city: "Pakistan",
      temp: "30°C",
      desc: "Thunderstorm",
    },
    { iconKey: "snow", city: "Canada", temp: "2°C", desc: "Snow" },
    { iconKey: "fog", city: "England", temp: "29°C", desc: "Fog" },
  ];

  return (
    <div
      className={`w-full min-h-screen ${getBackgroundClass()} bg-cover bg-no-repeat flex flex-col items-center justify-start px-4 pt-10 relative`}
    >
      <div className="absolute top-4 right-6 z-10">
        <button
          onClick={() =>
            setManualMode((prev) =>
              prev === "day" ? "night" : prev === "night" ? null : "day"
            )
          }
          className="px-4 py-2 rounded-full bg-white/30 border border-white text-white font-medium backdrop-blur-md hover:bg-white/50 transition-all shadow-md"
        >
          {manualMode === "day"
            ? "🌙 Night Mode"
            : manualMode === "night"
            ? "⚙️ Auto Mode"
            : "☀️ Day Mode"}
        </button>
      </div>

      <h1 className="text-white font-semibold text-center text-2xl sm:text-3xl md:text-4xl leading-tight mb-4">
        SkyCast – Real-Time Weather, Everywhere
      </h1>

      <p className="text-gray-200 text-sm mb-6">
        {new Date().toLocaleString()}
      </p>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md mx-auto mt-2 mb-10"
      >
        <input
          type="text"
          placeholder="Where do you want weather for ?"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-3 pr-12 rounded-lg bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-black-600 hover:text-black-800"
        >
          <FaSearch size={18} />
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-10">
        {weatherCards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(card)}
            className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl shadow-xl p-6 text-center hover:scale-105 hover:shadow-blue-400 transition-all duration-300 ease-in-out"
          >
            <div className="text-5xl mb-2">{iconMap[card.iconKey]}</div>
            <h2 className="text-xl font-semibold mb-1">{card.city}</h2>
            <p className="text-3xl font-bold mb-1">{card.temp}</p>
            <p className="text-sm text-gray-200">{card.desc}</p>
          </div>
        ))}
      </div>

      {isModalOpen && selectedWeather && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition duration-300 ease-in-out">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 w-96 shadow-2xl relative animate-fadeIn border border-blue-100 text-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-semibold"
            >
              ✕
            </button>
            <div className="text-6xl mb-4 text-blue-600 flex justify-center">
              {iconMap[selectedWeather.iconKey]}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedWeather.city}
            </h2>
            <p className="text-xl text-gray-700 mb-1">{selectedWeather.temp}</p>
            <p className="text-base text-gray-500 mb-2 italic">
              {selectedWeather.desc}
            </p>
            {selectedWeather.wind && (
              <p className="text-sm text-gray-600">
                💨 <span className="font-medium">Wind:</span>{" "}
                {selectedWeather.wind}
              </p>
            )}
          </div>
        </div>
      )}

      <footer className="text-gray-300 mt-10 text-sm text-center">
        © {new Date().getFullYear()} SkyCast by Iftikhar Jan. All rights
        reserved.
      </footer>
    </div>
  );
};

export default HeroSection;
