import React, { useState, useEffect } from "react";
import Card from "../../Components/Card/Card";
import axios from "axios";
import PopUp from "../../Components/PopUp/PopUp";

const Home = () => {
  const [data, setData] = useState([]);
  const userType = localStorage.getItem("userType");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStartupEmail, setSelectedStartupEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/users/opposite/${userType}`);
        setData(res.data); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userType) fetchData();
  }, [userType]); 

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 place-items-center">
        {data.map((company, index) => (
          <div key={index} className="w-full max-w-[350px]">
            <Card company={company}  onOpenPopup={() => {
                setSelectedStartupEmail(company.email); // ✅ Set selected startup email
                setIsOpen(true);
              }}/>
          </div>
        ))}
      </div>
      <PopUp isOpen={isOpen} onClose={() => setIsOpen(false)} startupEmail={selectedStartupEmail}  />
    </div>
  );
};

export default Home;
