import React, { useState, useEffect } from "react";
import dft from "../../images/default.jpeg";
import Button from "../../components/Button";
import {
  IconBookmark,
  IconHeart,
  IconHome,
  IconMessage,
  IconShare,
} from "@tabler/icons-react";
import { GridLoader, HashLoader } from "react-spinners";
import { useParams, useNavigate } from "react-router-dom";
const People = () => {
  const { userName } = useParams();
  const [posts, setposts] = useState([]);
  const [user, setuser] = useState([]);
  const [isFollowed, setisFollowed] = useState(false);
  const [isRequested, setisRequested] = useState(false);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const [commentOn, setcommentOn] = useState(false);
  const [data, setdata] = useState([]);
  const [User, setUser] = useState({});
  const [msg, setmsg] = useState("");
  const [search, setsearch] = useState("");
  useEffect(() => {
    const getPosts = async () => {
      setloading(true);
      const response = await fetch(
        `http://localhost:8000/api/people?userName=${userName}`,
        {
          method: "GET",
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user:token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setposts(data?.posts);
      setuser(data?.userDetail);
      setloading(false);
      setisFollowed(data?.isFollowed);
    };
    getPosts();
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
  const handleUnfollow = async () => {
    const response = await fetch("http://localhost:8000/api/unfollow", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user:token")}`,
      },
      body: JSON.stringify({ id: user.id }),
    });
    const data = await response.json();
    setisFollowed(data?.isFollowed);
    console.log(response, "resppo");
  };
  const handleFollow = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({ id: user.id }),
      });
      if (!response.ok) {
        throw new Error(`Failed to follow user: ${response.status}`);
      }
      const data = await response.json();
      setisFollowed(data?.isFollowed);
      setisRequested(data?.isRequested);
      console.log("Successfully followed user");
    } catch (error) {
      console.error("Error occurred while following user:", error.message);
    }
  };
  return (
    <div
      className="flex justify-center items-center bg-[#dde3f6]"
      style={{
        backgroundImage: `url(${user?.profilePic || dft})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {loading ? (
        <div className="h-[100%] flex justify-center items-center">
          <HashLoader />
        </div>
      ) : (
        <div className="border flex flex-col items-center p-10">
          <Button
            label={
              <div className="flex">
                <IconHome />
                <p>Home</p>
              </div>
            }
            className="fixed top-2 left-2 bg-[#7684cf] hover:bg-[#4f5ebb] rounded-2xl font-sans text-xl"
            onChange={() => navigate("/")}
          />
          <div className="w-full bg-white rounded-2xl mt-5 bg-opacity-50">
            <div className="flex flex-col justify-center items-center my-[6px]">
              <div className="flex flex-col my-4">
                <img
                  src={user?.profilePic || dft}
                  alt="Profile"
                  className="w-[120px] h-[120px] mx-6 rounded-full"
                />
                <div className="flex flex-col items-center mt-[7px]">
                  <p className="text-xl font-sans font-bold">
                    {user?.userName}
                  </p>
                  <p className="text-xs font-sans font-semibold">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div
                className="h-[50px] flex justify-around w-[300px] text-center cursor-pointer mb-[10px]"
                onClick={() => navigate("/followers")}
              >
                <div className="font-bold text-lg font-sans">
                  <h4>{user?.follower?.length || 0}</h4>
                  <p>Followers</p>
                </div>
                <div className="font-bold text-lg font-sans">
                  <h4>{user?.following?.length || 0}</h4>
                  <p>Following</p>
                </div>
                <div className="font-bold text-lg font-sans">
                  <h4>{posts.length}</h4>
                  <p>Posts</p>
                </div>
              </div>
              {!isFollowed ? (
                !isRequested ? (
                  <Button
                    label="Follow"
                    className="rounded-3xl mb-4 ml-15 bg-[#7684cf] hover:bg-[#4f5ebb] font-sans"
                    onChange={() => handleFollow()}
                  />
                ) : (
                  <Button
                    label="Requested"
                    className="rounded-3xl mb-4 ml-15 bg-[#7684cf] hover:bg-[#4f5ebb] font-sans"
                  />
                )
              ) : (
                <Button
                  label="Unfollow"
                  className="rounded-3xl mb-4 ml-15 bg-[#7684cf] hover:bg-[#4f5ebb] font-sans"
                  onChange={() => handleUnfollow()}
                />
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 w-40% m-4">
              {posts?.length > 0 &&
                posts?.map(
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
                      likes.length > 0 && likes.includes(user._id);
                    return (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="pb-4 mb-4 ">
                          {isVideo ? (
                            <video controls className="w-full rounded-t-lg">
                              <source src={image} type="video/mp4"></source>
                            </video>
                          ) : (
                            <img
                              src={image}
                              alt="Post"
                              className="w-[100%] m-0 p-0 rounded-t-lg"
                            />
                          )}
                          <div className="p-4">
                            <p className="font-semibold">{caption}</p>
                          </div>
                          <p>{description}</p>
                        </div>
                        <div className="flex justify-between p-4">
                          <div
                            className="flex items-center space-x-2 cursor-pointer"
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
                            <p>{likes.length} </p>
                          </div>
                          <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => {
                              setcommentOn(!commentOn);
                            }}
                          >
                            <IconMessage />
                            <p>{comment.length}</p>
                          </div>
                          <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => {
                              save.length > 0 && save.includes(User._id)
                                ? handleUnsaves(_id, index)
                                : handleSaves(_id, index);
                            }}
                          >
                            <IconBookmark />
                            <p>{save.length}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default People;
