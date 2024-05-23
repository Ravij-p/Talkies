import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { IconHome, IconSettings } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
const Setting = () => {
  const [user, setuser] = useState({});
  const navigate = useNavigate();
  const [isPrivate, setisPrivate] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:8000/api/setting", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const user1 = await response.json();
      setuser(user1.user);
      setisPrivate(user1.user.private);
    };
    fetchUser();
  }, []);
  const makeItPrivate = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/makePrivate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({ isPrivate: isPrivate }),
      });
      const user1 = await response.json();
      console.log(user1.user.private);
      setuser(user1.user);
      setisPrivate(user1?.user.private);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="flex items-center w-[100%] justify-center border-b pb-[7px]">
        <Button
          label={
            <div className="flex">
              <IconHome />
              <p>Home</p>
            </div>
          }
          className="fixed top-2 left-2 bg-[#8d91f4] hover:bg-[#525197]"
          onChange={() => navigate("/")}
        />
        <h1 className="font-bold text-[30px]">Settings</h1>
      </div>
      <div>
        {!isPrivate ? (
          <div>
            <p>Your account is public ,press button to make it private</p>
            <Button
              label="Private"
              className="mb-4 ml-4 rounded-3xl mr-20 bg-[#8d91f4] hover:bg-[#525197]"
              onChange={() => makeItPrivate()}
            ></Button>
          </div>
        ) : (
          <div>
            <p>Your account is private ,press button to make it public</p>
            <Button
              label="Public"
              className="mb-4 ml-4 rounded-3xl mr-20 bg-[#8d91f4] hover:bg-[#525197]"
              onChange={() => makeItPrivate()}
            ></Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
