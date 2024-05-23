import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dft from "../../images/default.jpeg";
import Button from "../../components/Button";
import { IconHome } from "@tabler/icons-react";
const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state);
  const Found = location.state.userFromUserName.length > 0 ? true : false;
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center w-[100%] justify-center border-b pb-[7px]">
        <Button
          label={
            <div className="flex">
              <IconHome />
              <p>Home</p>
            </div>
          }
          className="fixed top-2 left-2"
          onChange={() => navigate("/")}
        />
        <h1 className="font-bold text-[30px]">Searched Account</h1>
      </div>
      <div className="w-[100%] flex flex-col justify-center items-center">
        {Found ? (
          location.state.userFromUserName.map(({ userName, profilePic }) => {
            return (
              <div
                className="h-[55px] flex border-b justify-center cursor-pointer"
                onClick={() => {
                  navigate(`/user/${userName}`);
                }}
              >
                <img
                  src={profilePic || dft}
                  alt="ProfilePic"
                  className="h-[50px] w-[50px] rounded-3xl relative left-[5px]"
                ></img>
                <p className="flex justify-center items-center ml-[20px] text-[25px]">
                  {userName}
                </p>
              </div>
            );
          })
        ) : (
          <p>Not Found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
