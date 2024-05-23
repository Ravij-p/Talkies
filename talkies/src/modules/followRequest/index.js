import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dft from "../../images/default.jpeg";
import Button from "../../components/Button";
import { IconHome } from "@tabler/icons-react";
const FollowRequest = () => {
  const [User, setUser] = useState({});
  const darkMode = localStorage.getItem("dark") === "true";
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:8000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const data = await response.json();
      setUser(data.user);
      console.log(User.followRequest);
    };
    fetchUser();
  }, []);
  const handleAccept = async (id) => {
    const response = await fetch("http://localhost:8000/api/accept", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user:token")}`,
      },
      body: JSON.stringify({ requestedId: id }),
    });
    if (response.status == 200) {
      navigate("/followRequest");
    }
  };
  const handleReject = async (id) => {
    const response = await fetch("http://localhost:8000/api/reject", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user:token")}`,
      },
      body: JSON.stringify({ requestedId: id }),
    });
    if (response.status == 200) {
      navigate("/followRequest");
    }
  };
  return (
    <div
      className={`${
        darkMode ? "bg-[#0a0f27] bg-opacity-90 text-white" : "bg-white"
      }`}
    >
      <div
        className={`flex items-center w-[100%] justify-center pb-[7px] fixed shadow-lg top-0 ${
          darkMode ? "bg-[#0a0f27] bg-opacity-90 text-white" : "bg-[#dde3f6]"
        }`}
      >
        <Button
          label={
            <div className="flex">
              <IconHome />
              <p>Home</p>
            </div>
          }
          className="fixed top-2 left-2 mb-4 ml-4 rounded-3xl mr-20 bg-[#8d91f4] hover:bg-[#525197]"
          onChange={() => navigate("/")}
        />
        <h1 className="font-bold text-[30px]">Follow Requests</h1>
      </div>
      {User?.followRequest?.map(({ _id, profilePic, userName }) => {
        return (
          <div
            className={`flex flex-col border mt-[5%] ml-[30%] mr-[30%] ${
              darkMode
                ? "bg-[#0a0f27] bg-opacity-90 text-white"
                : "bg-[#dde3f6]"
            }`}
          >
            <div
              className="h-[55px] flex relative right-[2%] justify-center items-center cursor-pointer"
              onClick={() => {
                navigate(`/user/${userName}`);
              }}
            >
              <img
                src={profilePic || dft}
                alt="ProfilePic"
                className="h-[50px] w-[50px] rounded-3xl"
              ></img>
              <p className="ml-[20px] text-[25px]">{userName}</p>
            </div>
            <div className="flex justify-center items-center">
              <Button
                className="mb-4 ml-4 rounded-3xl bg-[#8d91f4] hover:bg-[#525197]"
                label="Accept"
                onChange={() => handleAccept(_id)}
              ></Button>
              <Button
                className="mb-4 ml-4 rounded-3xl mr-20 bg-[#8d91f4] hover:bg-[#525197]"
                label="Reject"
                onChange={() => handleReject(_id)}
              ></Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FollowRequest;
