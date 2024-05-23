import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import dft from "../../images/default.jpeg";
import logo from "../../images/logotalkies.png";
import { Link, useNavigate } from "react-router-dom";
import {
  IconBookmark,
  IconHeart,
  IconLogout,
  IconMessage,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { navigations, stats } from "./data";
import { GridLoader } from "react-spinners";
import "./home.css"; // Import CSS for styling
import { IconLock } from "@tabler/icons-react";
const Home = () => {
  const navigate = useNavigate();
  const [commentOn, setcommentOn] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("dark") === "true"
  );
  const [data, setdata] = useState([]);
  const [User, setUser] = useState({});
  const [loading, setloading] = useState(false);
  const [msg, setmsg] = useState("");
  const [search, setsearch] = useState("");
  const [isPrivate, setisPrivate] = useState(false);
  useEffect(() => {
    const fetchPosts = async () => {
      setloading(true);
      const response = await fetch("http://localhost:8000/api/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const data1 = await response.json();
      console.log(data1);
      setdata(data1.post1);
      console.log(data);
      setUser(data1.user);
      setloading(false);
    };
    fetchPosts();
  }, [darkMode]);
  const toggleDarkMode = () => {
    localStorage.setItem("dark", JSON.stringify(!darkMode));
    setDarkMode(!darkMode);
  };
  const handleSearch = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({ search: search }),
      });
      const res = await response.json();
      if (response.status === 200) {
        navigate("/search", {
          state: {
            userFromUserName: res.usersFromUserName,
            userFromEmail: res.usersFromEmail,
          },
        });
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSaves = async (_id, index) => {
    try {
      const response = await fetch("http://localhost:8000/api/save", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({ id: _id }),
      });
      const updatedPost = await response.json();
      const updatePost = data?.map((post, i) => {
        if (i === index) return updatedPost;
        else return post;
      });
      setdata(updatePost);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnsaves = async (_id, index) => {
    try {
      const response = await fetch("http://localhost:8000/api/Unsave", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({ id: _id }),
      });
      const updatedPost = await response.json();
      const updatePost = data?.map((post, i) => {
        if (i === index) return updatedPost;
        else return post;
      });
      setdata(updatePost);
    } catch (error) {
      console.log(error);
    }
  };
  const handleComment = async (_id, index, msg) => {
    try {
      const response = await fetch("http://localhost:8000/api/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({ id: _id, message: msg }),
      });
      const updatedPost = await response.json();
      const updatePost = data?.map((post, i) => {
        if (i === index) return updatedPost;
        else return post;
      });
      setdata(updatePost);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async (_id, index) => {
    try {
      const response = await fetch("http://localhost:8000/api/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({ id: _id }),
      });
      const updatedPost = await response.json();
      const updatePost = data?.map((post, i) => {
        if (i === index) return updatedPost;
        else return post;
      });
      setdata(updatePost);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnlike = async (_id, index) => {
    const response = await fetch("http://localhost:8000/api/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user:token")}`,
      },
      body: JSON.stringify({ id: _id }),
    });
    const updatedPost = await response.json();
    const updatePost = data?.map((post, i) => {
      if (i === index) return updatedPost;
      else return post;
    });
    setdata(updatePost);
  };
  const {
    userName = "",
    follower = [],
    following = [],
    posts = [],
  } = User || {};
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
      setUser(user1.user);
      setisPrivate(user1?.user.private);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="h-screen flex overflow-hidden">
      <div
        className={`w-[20%] flex flex-col ${
          darkMode ? "bg-[#0a0f27] text-white" : "bg-[#dde3f6]"
        }`}
      >
        {loading ? (
          <div className="h-[100%] flex justify-center items-center">
            <GridLoader />
          </div>
        ) : (
          <div className="h-[30%] flex justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <div className="flex my-4">
                <img
                  src={User?.profilePic || dft}
                  alt="Profile"
                  className="w-[25%] mx-6 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="mt-4 mb-0 pb-0 text-xl font-bold">
                    {User.userName}
                  </p>
                  <p className="text-xs mb-4 font-semibold">{User.email}</p>
                </div>
              </div>
              <div
                className="h-[50px] flex justify-around w-[300px] text-center cursor-pointer"
                onClick={() => navigate("/followers")}
              >
                <div className="font-light text-lg">
                  <h4>{follower.length}</h4>
                  <p>Followers</p>
                </div>
                <div className="font-light text-lg">
                  <h4>{following.length}</h4>
                  <p>Following</p>
                </div>
                <div className="font-light text-lg">
                  <h4>{posts.length}</h4>
                  <p>Posts</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="h-[55%] flex flex-col justify-evenly pl-12">
          {navigations.map(({ id, name, icon, url }) => {
            return (
              <Link
                to={url}
                key={id}
                className={`flex items-center h-[40px] rounded-2xl px-4 ${
                  darkMode
                    ? "text-white hover:bg-[#C9D2F6] hover:text-black"
                    : "bg-[#dde3f6] text-black hover:bg-[#C9D2F6]"
                }`}
              >
                {icon}
                <p className="ml-2">{name}</p>
                {id === 2 && User.followRequest?.length > 0 && (
                  <p className="text-white flex bg-[#0000Ff] hover:text-black rounded-full w-[25px] flex justify-center align-items ml-5">
                    {User.followRequest.length}
                  </p>
                )}
              </Link>
            );
          })}
          <div className="flex justify-items">
            <div className="flex items-center ml-4">
              <IconLock />
              <p className="ml-2">Account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-5">
              <input
                className="sr-only peer"
                value=""
                type="checkbox"
                onChange={makeItPrivate}
              />
              <div className="group peer ring-0 bg-gray-50 border-2 border-gray-900 rounded-full outline-none duration-700 after:duration-200 w-16 h-8 shadow-md peer-checked:bg-gradient-to-r peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-gray-900 after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 peer-checked:after:translate-x-6 peer-hover:after:scale-95">
                <svg
                  y="0"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0"
                  width="100"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                  height="100"
                  className="absolute top-1 left-8 fill-blue-600 w-6 h-6"
                >
                  <path
                    d="M50,18A19.9,19.9,0,0,0,30,38v8a8,8,0,0,0-8,8V74a8,8,0,0,0,8,8H70a8,8,0,0,0,8-8V54a8,8,0,0,0-8-8H38V38a12,12,0,0,1,23.6-3,4,4,0,1,0,7.8-2A20.1,20.1,0,0,0,50,18Z"
                    className="svg-fill-primary"
                  ></path>
                </svg>

                <svg
                  y="0"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0"
                  width="100"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                  height="100"
                  className="absolute top-1 left-1 fill-red-600 w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M30,46V38a20,20,0,0,1,40,0v8a8,8,0,0,1,8,8V74a8,8,0,0,1-8,8H30a8,8,0,0,1-8-8V54A8,8,0,0,1,30,46Zm32-8v8H38V38a12,12,0,0,1,24,0Z"
                  ></path>
                </svg>
              </div>
            </label>
          </div>
        </div>
        <div className="h-[15%] pt-10">
          <div
            className={`ml-12 cursor-pointer flex items-center h-[40px] rounded-2xl px-4 ${
              darkMode
                ? "text-white hover:bg-[#C9D2F6] hover:text-black"
                : "bg-[#dde3f6] text-black hover:bg-[#C9D2F6]"
            }`}
            onClick={() => {
              localStorage.clear();
              navigate("/account/signin");
            }}
          >
            <IconLogout />
            <p className="ml-2 ">Log out</p>
          </div>
        </div>
      </div>
      <div
        className={`w-[60%] h-full overflow-scroll scrollbar-hide ${
          darkMode ? "bg-[#0a0f27] bg-opacity-90 text-white" : "bg-white"
        }`}
      >
        <div
          className={`h-[75px] flex justify-center items-center sticky top-0 shadow-md ${
            darkMode ? "bg-[#0a0f27] bg-opacity-90 text-white" : "bg-[#dde3f6]"
          }`}
        >
          <div className="flex justify-center items-center mt-3">
            <Input
              placeholder="Search"
              className="rounded-3xl"
              value={search}
              onChange={(e) => {
                setsearch(e.target.value);
              }}
            />
            <Button
              label={<IconSearch />}
              className="mb-4 ml-4 rounded-3xl mr-20 bg-[#8d91f4] hover:bg-[#525197]"
              onChange={() => {
                handleSearch();
              }}
            ></Button>
          </div>
          <Button
            label={
              <div className="flex">
                <IconPlus />
                <p className="ml-2">Create New Post</p>
              </div>
            }
            className="rounded-3xl mb-4 ml-15 bg-[#8d91f4] hover:bg-[#525197] mt-3"
            onChange={() => {
              navigate("/new-post");
            }}
          ></Button>
        </div>
        {loading ? (
          <div className="h-[100%] flex justify-center items-center">
            <GridLoader />
          </div>
        ) : (
          data?.map(
            (
              {
                _id = "",
                caption = "",
                description = "",
                image = "",
                user = {},
                likes = [],
                comment = [],
                save = [],
                isVideo = false,
              },
              index
            ) => {
              const isAlreadyLiked =
                likes.length > 0 && likes.includes(User._id);
              return (
                <div
                  className={`w-[75%] mx-auto mt-20 p-8 ${
                    darkMode
                      ? "bg-[#0a0f27] bg-opacity-90 text-white"
                      : "bg-[#dde3f6]"
                  }`}
                >
                  <div
                    className=" flex items-center pb-4 mb-4 cursor-pointer"
                    onClick={() =>
                      userName === user.userName
                        ? navigate("/profile")
                        : navigate(`/user/${user?.userName}`)
                    }
                  >
                    <div className="flex my-4">
                      <img
                        src={user?.profilePic || dft}
                        alt="Profile"
                        className="w-[17%] mx-6 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="mt-4 mb-0 pb-0 text-xl font-bold">
                          {user.userName}
                        </p>
                        <p className="text-xs mb-4 font-semibold">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pb-4 mb-4 flex flex-col justify-center items-center h-[75%] mt-9">
                    {isVideo ? (
                      <video
                        autoplay
                        controls
                        className="w-[100%] m-0 p-0 rounded-2xl"
                      >
                        <source src={image}></source>
                      </video>
                    ) : (
                      <img
                        src={image}
                        alt="Post"
                        className="w-[100%] m-0 p-0 rounded-2xl"
                      />
                    )}
                    <div className="flex mt-4 mb-2 pb-2">
                      <h4 className="mr-4 font-bold">{user.email}:</h4>
                      <p className="font-medium">{caption}</p>
                    </div>
                    <p className="mt-3">{description}</p>
                  </div>
                  <div className="flex justify-evenly mb-4 pb-3">
                    <div
                      className="flex cursor-pointer"
                      onClick={
                        isAlreadyLiked
                          ? () => handleUnlike(_id, index)
                          : () => handleLike(_id, index)
                      }
                    >
                      <IconHeart
                        fill={isAlreadyLiked ? "red" : "white"}
                        color={isAlreadyLiked ? "red" : "black"}
                      />
                      <p>{likes?.length}</p>
                    </div>
                    <div
                      className="flex cursor-pointer"
                      onClick={() => {
                        setcommentOn(!commentOn);
                      }}
                    >
                      <IconMessage />
                      <p>{comment?.length}</p>
                    </div>
                    <div
                      className="flex cursor-pointer"
                      onClick={() => {
                        save.length > 0 && save.includes(User._id)
                          ? handleUnsaves(_id, index)
                          : handleSaves(_id, index);
                      }}
                    >
                      <IconBookmark
                        fill={
                          save.length > 0 && save.includes(User._id)
                            ? "blue"
                            : "white"
                        }
                        color={
                          save.length > 0 && save.includes(User._id)
                            ? "blue"
                            : "black"
                        }
                      />
                      <p>{save?.length}</p>
                    </div>
                  </div>
                  <div id="comment" className={commentOn ? "" : "hidden"}>
                    <div id="ipt" className="flex justify-center items-center">
                      <p className="font-semibold">Comment :</p>
                      <Input
                        type="text"
                        value={msg}
                        className="rounded-3xl"
                        onChange={(e) => {
                          setmsg(e.target.value);
                        }}
                      />
                      <Button
                        label="Comment"
                        className="mb-4 ml-4 rounded-3xl mr-20 bg-[#8d91f4] hover:bg-[#525197]"
                        onChange={() => {
                          handleComment(_id, index, msg);
                        }}
                      ></Button>
                    </div>
                    <div className="flex flex-col">
                      {comment?.map(({ commentUser = "", msg = "" }) => {
                        return (
                          <div className="flex w-[100%]">
                            <p className="font-semibold">{commentUser} :</p>
                            <p>{msg}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
          )
        )}
      </div>
      <div
        className={`w-[20%]  ${
          darkMode ? "bg-[#0a0f27] text-white" : "bg-[#dde3f6]"
        } overflow-scroll scrollbar-hide`}
      >
        <div className="h-[30%]">
          <img src={logo} alt="Logo" className="object-contain"></img>
        </div>
        <div className="h-[55%] flex flex-col justify-evenly pl-12">
          {stats.map(({ id, name, icon, url }) => {
            return (
              <Link
                to={url}
                key={id}
                className={`cursor-pointer flex items-center  hover:bg-[#C9D2F6] ${
                  darkMode ? "text-white hover:text-black" : "text-black"
                } h-[40px] rounded-2xl px-4`}
              >
                {icon}
                <p className="ml-2">{name}</p>
              </Link>
            );
          })}
        </div>
        <div className="h-[15%] flex items-center w-[100%] justify-evenly">
          <p>Dark Mode</p>
          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      {/* Toggle Dark Mode Button */}
    </div>
  );
};

export default Home;
