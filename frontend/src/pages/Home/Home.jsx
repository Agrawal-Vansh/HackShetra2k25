import React, { useState, useEffect } from "react";
import Card from "../../Components/Card/Card";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);
  const userType = localStorage.getItem("userType");
  console.log(userType);

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
    <div className="min-h-screen bg-gray-800 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {data.map((company, index) => (
          <Card key={index} company={company} />
        ))}
      </div>
    </div>
  );
};

export default Home;
