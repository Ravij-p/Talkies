import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBookmark,
  IconHeart,
  IconHome,
  IconMessage,
  IconTrash,
} from "@tabler/icons-react";
import dft from "../../images/default.jpeg";
import Input from "../../components/Input";
import Button from "../../components/Button";
const Profile = () => {
  const [data, setdata] = useState({
    profilePic: "",
  });
  const navigate = useNavigate();
  const [commentOn, setcommentOn] = useState(false);
  const [pic, setpic] = useState("");
  const [url, seturl] = useState("");
  const darkMode = localStorage.getItem("dark") === "true";
  const [posts, setposts] = useState([]);
  const [User, setUser] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      const response = await fetch("http://localhost:8000/api/profile", {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const data = await response.json();
      setposts(data?.posts);
      setUser(data?.user);
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

  const deletePost = async (_id, index) => {
    try {
      const response = await fetch("http://localhost:8000/api/deletePost", {
        method: "DELETE",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({ postId: _id }),
      });
      const data = await response.json();
      console.log(data);
      setUser(data?.user);
      setposts(data?.post);
    } catch (error) {
      console.log(error);
    }
  };
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", data.profilePic);
    formData.append("upload_preset", "talkies");
    formData.append("cloud_name", "dxnbifyht");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxnbifyht/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) {
      return await res.json();
    } else return "Error";
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { secure_url } = await uploadImage();
      seturl(secure_url);
      const response = await fetch("http://localhost:8000/api/profilePic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({
          url: secure_url,
        }),
      });
      const { profilePic } = await response.json();
      console.log(profilePic, "<=profilePic");
      setpic(profilePic);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="flex justify-center items-center bg-[#dde3f6]"
      style={{
        backgroundImage: `url(${User?.profilePic || dft})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
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
        <h1 className="font-bold text-[30px]">Your Saved Posts</h1>
      </div>
      <div className="w-full bg-white rounded-2xl mt-5 bg-opacity-50">
        <div className="flex flex-col justify-center items-center my-[6px]">
          <div className="flex flex-col my-4">
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="flex flex-col my-4 items-center">
                <img
                  src={User?.profilePic || dft}
                  alt="Profile"
                  className="w-[120px] h-[120px] mx-6 rounded-full"
                />
                <div className="flex flex-col items-center mt-[7px]">
                  <p className="text-xl font-sans font-bold">
                    {User?.userName}
                  </p>
                  <p className="text-xs font-sans font-semibold">
                    {User?.email}
                  </p>
                </div>
              </div>
              <Input
                type="file"
                name="image"
                className="py-4 hidden"
                onChange={(e) =>
                  setdata({ ...data, profilePic: e.target.files[0] })
                }
                isRequired={false}
              />
              <label
                htmlFor="image"
                className="cursor-pointer border shadow w-full p-[8.25px] mr-[15px] rounded-2xl bg-[#7684cf] hover:bg-[#4f5ebb] font-sans text-xl text-white font-bold"
              >
                {data?.img?.name || "Upload Image"}
              </label>
              <Button
                label="Add Profile Pic"
                type="submit"
                className="mt-6 rounded-2xl rounded-2xl bg-[#7684cf] hover:bg-[#4f5ebb] font-sans text-xl"
              />
            </form>
          </div>
          <div className="rounded-lg bg-[#dde3f6] grid grid-cols-3 gap-4 w-40% m-4">
            {posts?.length > 0 &&
              posts?.map(
                (
                  {
                    _id,
                    caption = "",
                    description = "",
                    image = "",
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
                        <div
                          className="flex cursor-pointer hover:text-red"
                          onClick={() => {
                            deletePost(_id, index);
                          }}
                        >
                          <IconTrash />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
