import React, { useEffect, useState } from "react";
import dft from "../../images/default.jpeg";
import { useNavigate } from "react-router-dom";
import { IconHome } from "@tabler/icons-react";
import Button from "../../components/Button";
const Followers = () => {
  const [FollowingList, setFollowingList] = useState([]);
  const [FollowerList, setFollowerList] = useState([]);
  const darkMode = localStorage.getItem("dark") === "true";
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFollowData = async () => {
      const response = await fetch("http://localhost:8000/api/followShow", {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const data = await response.json();
      console.log(data?.followerList, data?.followingList);
      setFollowerList(data?.followerList);
      setFollowingList(data?.followingList);
    };
    fetchFollowData();
  }, []);
  return (
    <div
      className={`${
        darkMode ? "bg-[#0a0f27] bg-opacity-90 text-white" : "bg-[#dde3f6]"
      } flex flex-col items-center h-screen`}
    >
      <div
        className={` w-[100%] justify-center pb-[7px] fixed shadow-lg top-0 ${
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
          className="mt-2 ml-2 mb-4 ml-4 rounded-3xl mr-20 bg-[#8d91f4] hover:bg-[#525197]"
          onChange={() => navigate("/")}
        />
      </div>
      <div className="w-full md:w-1/2 mt-[5%]">
        <h2 className="font-bold text-xl mb-4">Followers</h2>
        {FollowerList?.map(({ followerId }) => {
          return (
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate(`/user/${followerId?.userName}`)}
            >
              <img
                src={followerId?.profilePic || dft}
                alt="ProfilePic"
                className="h-10 w-10 rounded-full mr-4"
              />
              <div className="flex justify-center ml-[10px]">
                <p className="text-lg">{followerId?.userName}</p>
              </div>
            </div>
          );
        })}

        <div className="w-full md:w-1/2">
          <h1 className="font-bold text-xl mb-4">Following</h1>
          {FollowingList?.map(({ followedId }) => {
            return (
              <div
                className="flex items-center  cursor-pointer"
                onClick={() => navigate(`/user/${followedId?.userName}`)}
              >
                <img
                  src={followedId?.profilePic || dft}
                  alt="ProfilePic"
                  className="h-10 w-10 rounded-full mr-4"
                />
                <div className="flex justify-center ml-[10px]">
                  <p className="text-lg">{followedId?.userName}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Followers;
