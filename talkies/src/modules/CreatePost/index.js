import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { IconHome } from "@tabler/icons-react";
const CreatePost = () => {
  const [data, setdata] = useState({
    caption: "",
    desc: "",
    img: "",
  });
  const [url, seturl] = useState("");
  const darkMode = localStorage.getItem("dark") === "true";
  const navigate = useNavigate();
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", data.img);
    formData.append("upload_preset", "talkies");
    formData.append("cloud_name", "dxnbifyht");
    console.log(data.img.type, "data ka type bro::::");

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
    e.preventDefault();
    const { secure_url } = await uploadImage();
    seturl(secure_url);
    const response = await fetch("http://localhost:8000/api/new-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user:token")}`,
      },
      body: JSON.stringify({
        caption: data.caption,
        desc: data.desc,
        url: secure_url,
        userId: "65f47bd5c81a4a8a1f7507e4",
        isVideo: data.img.type.includes("video") ? true : false,
      }),
    });
    if (response.status == 200) {
      navigate("/");
    } else {
      console.log("error");
    }
  };
  return (
    <div
      className={`flex ${
        darkMode ? "bg-[#0a0f27]" : "bg-[#dde3f6]"
      } justify-center items-center h-screen`}
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
        <h1 className="font-bold text-[30px]">Your Commented Posts</h1>
      </div>
      <div className="w-[800px] mt-[10%] h-[600px] p-6">
        <form onSubmit={(e) => handleSubmit(e)}>
          <Input
            placeholder="Captions..."
            name="title"
            className="py-4 rounded-2xl"
            value={data.caption}
            onChange={(e) => setdata({ ...data, caption: e.target.value })}
          />
          <textarea
            rows={10}
            className="w-full border shadow py-4 px-4 resize-none rounded-2xl"
            placeholder="Description"
            value={data.desc}
            onChange={(e) => setdata({ ...data, desc: e.target.value })}
          />
          <Input
            type="file"
            name="image"
            className="py-4 hidden"
            onChange={(e) => setdata({ ...data, img: e.target.files[0] })}
            isRequired={false}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-white p-4 border shadow w-full rounded-2xl"
          >
            {data?.img?.name || "Upload Image"}
          </label>
          <Button
            label="Create post"
            type="submit"
            className="my-5 w-full bg-[#7684cf] hover:bg-[#4f5ebb] rounded-2xl font-sans text-xl"
          />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
