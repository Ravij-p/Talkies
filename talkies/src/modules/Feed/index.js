import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBookmark,
  IconHeart,
  IconMessage,
  IconShare,
  IconHome,
} from "@tabler/icons-react";
import dft from "../../images/default.jpeg";
import Input from "../../components/Input";
import Button from "../../components/Button";
const Feed = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState([]);
  const darkMode = localStorage.getItem("dark") === "true";
  const [User, setUser] = useState({});
  const [commentOn, setcommentOn] = useState(false);
  const [msg, setmsg] = useState("");
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://localhost:8000/api/allPosts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const data1 = await response.json();
      setdata(data1.post1);
      console.log(data1.post1);
      setUser(data1.user);
    };
    fetchPosts();
  }, []);
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
  return (
    <div
      className={` ${
        darkMode ? "bg-[#0a0f27] bg-opacity-80 text-white" : "bg-white"
      }`}
    >
      <div
        className={`flex items-center w-[100%] justify-center border-b pb-[7px] fixed shadow-lg top-0 ${
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
        <h1 className="font-bold text-[30px]">Feed</h1>
      </div>
      {data?.map(
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
          const isAlreadyLiked = likes.length > 0 && likes.includes(User._id);
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
                onClick={() => navigate(`/user/${user?.userName}`)}
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
                    <p className="text-xs mb-4 font-semibold">{user.email}</p>
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
      )}
    </div>
  );
};

export default Feed;
