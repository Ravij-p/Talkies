const express = require("express");
const cookieParser = require("cookie-parser");
const bcryptjs = require("bcryptjs");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
const Users = require("./models/userSchema");
const Post = require("./models/postSchema");
const Msg = require("./models/msg");
const Contacts = require("./models/contactSchema");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const userOTPverification = require("./models/userOTPverification");
require("./db/connection");
const authenticate = require("./middleware/auth");
const mongoose = require("mongoose");
const msg = require("./models/msg");
const { Timestamp } = require("mongodb");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello world");
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

const onlineUsers = new Map();
io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-message", async ({ senderId, receiverId, msg }) => {
    const newMsg = await Msg.create({
      sender: senderId,
      receiver: receiverId,
      msg,
      timestamp: Date.now(),
    });

    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receive-message", newMsg);
    }
    socket.emit("receive-message", newMsg); // confirm to sender
  });

  socket.on("load_messages", async ({ userId, otherUserId }) => {
    try {
      const messages = await Msg.find({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      }).sort({ timestamp: 1 });

      socket.emit("messages_loaded", messages);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  });

  socket.on("disconnect", () => {
    for (const [uid, sid] of onlineUsers.entries()) {
      if (sid === socket.id) {
        onlineUsers.delete(uid);
        break;
      }
    }
  });
});
app.post("/api/sendMsg", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { msg, receiverId } = req.body;
    console.log("msg", msg, "id", receiverId);

    const newMsg = await Msg.create({
      sender: user._id,
      receiver: receiverId,
      msg: msg,
      timestamp: Date.now(),
    });
    return res.status(200).send("done");
  } catch (e) {
    console.log(e);
  }
});
app.post("/api/getMsg", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const receiverId = req.body.receiverId;
    console.log("reciever Id", receiverId);

    const msgs = await Msg.find({
      $or: [
        { sender: user._id, receiver: receiverId },
        { sender: receiverId, receiver: user._id },
      ],
    }).sort({ timestamp: -1 });
    return res.status(200).json({ msgs });
  } catch (e) {
    console.log(e);
  }
});
app.get("/api/userList", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const lists = await Contacts.find({
      followerId: user._id,
      isMsg: true,
    }).populate("followerId", "profilePic userName");
    return res.status(200).json({ lists, user });
  } catch (err) {
    console.log(err);
  }
});
app.post("/api/newChat", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const search = req.body.search || "";
    const usersFollowingMe = await Contacts.find({
      followedId: user._id,
    }).select("followerId");
    console.log(usersFollowingMe);
    const UsersAll = await Users.find({
      $or: [
        { userName: { $regex: search, $options: "i" } },
        { _id: { $in: usersFollowingMe.followerId } },
      ],
    });
    res.status(200).json({ UsersAll });
  } catch (e) {
    console.log(e);
  }
});
app.post("/api/search", authenticate, async (req, res) => {
  try {
    const search = req.body.search;
    const usersFromUserName = await Users.find({
      userName: { $regex: search, $options: "i" },
    });
    if (!usersFromUserName) {
      console.log("Nothing");
      return res.status(400).send("Not found");
    }
    res.status(200).json({ usersFromUserName });
  } catch (error) {
    console.log(error);
  }
});
app.post("/api/sendOTP", async (req, res, next) => {
  try {
    const { userName, email, password, profilePic } = req.body;
    if (!userName || !email || !password) {
      res.status(400).send("Cannot be empty");
    }
    const isExist = await Users.findOne({ email });
    if (isExist) {
      return res.status(400).send("User already exists");
    }
    const hp = await bcryptjs.hash(password, 10);
    const user = new Users({
      userName,
      email,
      password: hp,
      profilePic,
      private: false,
    });
    try {
      const result = await user.save();
      await sendOTPVerificationEmail(result, res);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      res.json({
        status: "Failed",
        message: "an error occurred",
      });
    }
    res.status(200).send("Success");
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("Server Error");
  }
});
server.listen(5000, () => {
  console.log("Server listening on port 8000");
});
app.post("/api/verifyOTP", async (req, res, next) => {
  try {
    const { user } = req;
    const { OTP } = req.body;
    if (!OTP) {
      res.status(400).send("Cannot be empty");
    }
    const data = await userOTPverification({ _id: user._id });
    const genOTP = data.otp;
    if (genOTP == OTP) {
      return res.status(200).send("Success");
    } else {
      return res.status(400).send("not verified");
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).send("Server Error");
  }
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  console.log(user, "user");
  if (!user) {
    res.status(401).send("User or password is invalid");
  } else {
    const validate = await bcryptjs.compare(password, user.password);
    if (!validate) {
      res.status(401).send("user or password is invalid");
    } else {
      const payload = {
        id: user._id,
        userName: user.userName,
      };
      const JWT_SECRET_KEY =
        process.env.JWT_SECRET_KEY || "THIS_IS_THE_SECRET_KEY_OF_JWT";
      jwt.sign(
        payload,
        JWT_SECRET_KEY,
        {
          expiresIn: 86400,
        },
        async (err, token) => {
          if (err) res.json({ message: err });
          await Users.updateOne(
            { _id: user._id },
            {
              $set: { token },
            }
          );
          return res.status(200).json({ user, token });
        }
      );
    }
  }
});
app.put("/api/profilePic", authenticate, async (req, res) => {
  try {
    const { url } = req.body;
    const { user } = req;
    console.log(user, "<=user");
    if (!url) {
      return res.status(400).send("Please fill all the fields");
    }
    console.log(url, "<=url");
    const updatedUser = await Users.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { profilePic: url },
      },
      {
        returnDocument: "after",
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Error" + error);
  }
});
app.post("/api/new-post", authenticate, async (req, res) => {
  try {
    const { caption, desc, url, isVideo } = req.body;
    const { user } = req;
    if (!caption || !desc || !url) {
      res.status(400).send("Please fill all the fields");
    }
    console.log(isVideo);
    const createPost = await Post.create({
      caption,
      description: desc,
      image: url,
      user: user._id,
      isVideo: isVideo,
    });
    const updatedUser = await Users.findOneAndUpdate(
      { _id: user._id },
      {
        $push: { posts: createPost },
      },
      {
        returnDocument: "after",
      }
    );
    await updatedUser.save();
    console.log(createPost);
    res.status(200).send("Created post successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error" + error);
  }
});
app.get("/api/profile", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const posts = await Post.find({ user: user._id }).populate(
      "user",
      "_id userName email"
    );
    res.status(200).json({ posts, user });
  } catch (error) {
    res.status(200).send(error);
  }
});
app.get("/api/posts", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const followers = await Contacts.find({ followerId: user._id });
    const post1 = [];
    const ownPost = await Post.find({ user: user._id }).populate(
      "user",
      "_id userName email profilePic"
    );
    console.log(ownPost, "ownPost");
    ownPost.forEach((post) => {
      post1.push(post);
    });
    for (const obj of followers) {
      const objId = obj.followedId;
      console.log("obj", objId);
      try {
        const posts = await Post.find({ user: objId }).populate(
          "user",
          "_id userName email profilePic"
        );
        posts.forEach((post) => {
          post1.push(post);
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    console.log("sent");
    res.status(200).json({ post1, user });
  } catch (error) {
    res.status(200).send(error);
  }
});
app.get("/api/allSaves", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const posts = await Post.find({ save: user._id })
      .populate("user", "_id userName email profilePic")
      .sort({ _id: -1 });
    res.status(200).json({ posts, user });
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/api/allLikes", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const posts = await Post.find({ likes: user._id })
      .populate("user", "_id userName email profilePic")
      .sort({ _id: -1 });
    res.status(200).json({ posts, user });
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/api/allPosts", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const users = await Users.find({ private: false });
    const post1 = [];
    for (const obj of users) {
      const objId = obj._id;
      console.log("obj", objId);
      try {
        const posts = await Post.find({ user: objId })
          .populate("user", "_id userName email profilePic")
          .sort({ _id: -1 });
        posts.forEach((post) => {
          post1.push(post);
        });
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    res.status(200).json({ post1, user });
  } catch (error) {
    res.status(200).send(error);
  }
});
app.get("/api/allComments", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const posts = await Post.find({ "comment.commentUser": user.userName })
      .populate("user", "_id userName email profilePic")
      .sort({ _id: -1 });
    res.status(200).json({ posts, user });
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/api/followShow", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const followerList = await Contacts.find({
      followedId: user._id,
    }).populate("followerId", "_id userName profilePic");
    const followingList = await Contacts.find({
      followerId: user._id,
    }).populate("followedId", "_id userName profilePic");
    res.status(200).json({ followerList, followingList });
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/api/people", authenticate, async (req, res) => {
  try {
    const { userName } = req.query;
    const { user: follower } = req;
    const user = await Users.findOne({ userName: userName });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const posts = await Post.find({ user: user._id });
    const [isFollowed] = await Contacts.find({
      followedId: follower._id,
      followedId: user._id,
    });
    console.log(isFollowed);
    const userDetail = {
      id: user._id,
      userName: user.userName,
      email: user.email,
      follower: user.follower,
      following: user.following,
      profilePic: user.profilePic,
    };
    console.log(userDetail);
    res.status(200).json({ posts, userDetail, isFollowed: !!isFollowed });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/follow", authenticate, async (req, res) => {
  try {
    const { id } = req.body;
    const { user } = req;
    console.log("user", user);
    console.log("req body", req.body);
    if (!id) return res.status(400).send("id cannot be empty");
    const followerUser = await Users.findOne({ _id: id });
    console.log(followerUser.private);
    if (followerUser.private) {
      const newUser = await Users.findOneAndUpdate(
        { _id: id },
        {
          $push: { followRequest: user._id },
        },
        {
          returnDocument: "after",
        }
      );
      res.status(200).json({ isFollowed: false, isRequested: true });
    } else {
      const followUser = new Contacts({
        followerId: user._id,
        followedId: id,
      });
      const updatedUser = await Users.findOneAndUpdate(
        { _id: id },
        {
          $push: { follower: user._id },
        },
        {
          returnDocument: "after",
        }
      );
      await updatedUser.save();
      const updatedUser2 = await Users.findOneAndUpdate(
        { _id: user._id },
        {
          $push: { following: id },
        },
        {
          returnDocument: "after",
        }
      );
      await updatedUser2.save();
      await followUser.save();
      res.status(200).json({ isFollowed: true, isRequested: false });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
app.delete("/api/unfollow", authenticate, async (req, res) => {
  try {
    const { id } = req.body;
    const { user } = req;
    console.log(req.body);
    if (!id) return res.status(400).send("id cannot be empty");
    await Contacts.deleteOne({
      followerId: user._id,
      followedId: id,
    });
    const updatedUser = await Users.findOneAndUpdate(
      { _id: id },
      {
        $pull: { follower: user._id },
      },
      {
        returnDocument: "after",
      }
    );
    await updatedUser.save();
    const updatedUser2 = await Users.findOneAndUpdate(
      { _id: user._id },
      {
        $pull: { following: id },
      },
      {
        returnDocument: "after",
      }
    );
    await updatedUser2.save();
    res.status(200).json({ isFollowed: false });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
app.put("/api/save", authenticate, async (req, res) => {
  try {
    const { id } = req.body;
    const { user } = req;
    if (!id) return res.status(400).send("id cannot be empty");
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        $push: { save: user._id },
      },
      {
        returnDocument: "after",
      }
    ).populate("user", "_id userName email profilePic");
    res.status(200).json(updatedPost);
  } catch (e) {
    res.status(500).send("error");
  }
});
app.put("/api/unsave", authenticate, async (req, res) => {
  try {
    const { id } = req.body;
    const { user } = req;
    if (!id) return res.status(400).send("id cannot be empty");
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        $pull: { save: user._id },
      },
      {
        returnDocument: "after",
      }
    ).populate("user", "_id userName email profilePic");
    res.status(200).json(updatedPost);
  } catch (e) {
    res.status(500).send("error");
  }
});
app.put("/api/like", authenticate, async (req, res) => {
  try {
    const { id } = req.body;
    const { user } = req;
    if (!id) return res.status(400).send("id cannot be empty");
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        $push: { likes: user._id },
      },
      {
        returnDocument: "after",
      }
    ).populate("user", "_id userName email profilePic");
    res.status(200).json(updatedPost);
  } catch (e) {
    res.status(500).send("error");
  }
});
app.put("/api/unlike", authenticate, async (req, res) => {
  try {
    const { id } = req.body;
    const { user } = req;
    if (!id) return res.status(400).send("id cannot be empty");
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        $pull: { likes: user._id },
      },
      {
        returnDocument: "after",
      }
    ).populate("user", "_id userName email profilePic");
    res.status(200).json(updatedPost);
  } catch (e) {
    res.status(500).send("error");
  }
});
app.put("/api/comment", authenticate, async (req, res) => {
  try {
    const { id, message } = req.body;
    console.log(req.body);
    const { user } = req;
    if (message == "") return res.status(400).send("message cannot be empty");
    if (!id) return res.status(400).send("id cannot be empty");
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        $push: { comment: { commentUser: user.userName, msg: message } },
      },
      {
        returnDocument: "after",
      }
    ).populate("user", "_id userName email profilePic");
    res.status(200).json(updatedPost);
  } catch (e) {
    res.status(500).send("error");
  }
});
app.listen(port, () => {
  console.log("Server is Running");
});
app.get("/api/setting", authenticate, async (req, res) => {
  try {
    const { user } = req;
    res.status(200).send({ user });
  } catch (e) {
    res.status(500).send(e);
  }
});
app.put("/api/makePrivate", authenticate, async (req, res) => {
  try {
    const { user } = req;
    console.log(user);
    const { isPrivate } = req.body;
    console.log(isPrivate);
    const updatedUser = await Users.findOneAndUpdate(
      { _id: user._id },
      { $set: { private: !user.private } },
      { returnDocument: "after" }
    );
    res.status(200).send({ user: updatedUser });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
app.get("/api/users", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const requiredUser = await Users.findOne({ _id: user._id }).populate(
      "followRequest",
      "profilePic userName "
    );
    console.log(requiredUser);
    res.status(200).send({ user: requiredUser });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
app.put("/api/accept", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { requestedId } = req.body;
    console.log(user.userName, requestedId);
    const mainUser = await Users.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        $pull: { followRequest: requestedId },
        $push: { follower: requestedId },
      },
      {
        returnDocument: "after",
      }
    );

    const requestedUser = await Users.findOneAndUpdate(
      {
        _id: requestedId,
      },
      {
        $push: { following: user._id },
      },
      {
        returnDocument: "after",
      }
    );
    const newContact = new Contacts({
      followerId: requestedId,
      followedId: user._id,
    });
    await newContact.save();
    res.status(200).send("Success");
  } catch (e) {
    console.log(e);
    re.status(500).send(e);
  }
});
app.put("/api/reject", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { requestedId } = req.body;
    const mainUser = await Users.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        $pull: { followRequest: requestedId },
      },
      {
        returnDocument: "after",
      }
    );
    res.status(200).send("Success");
  } catch (e) {
    console.log(e);
    re.status(500).send(e);
  }
});
app.delete("/api/deletePost", authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { postId } = req.body;
    await Post.deleteOne({ _id: postId });
    const updatedPost = await Post.find({ user: user._id });
    const mainUser = await Users.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        $pull: { posts: postId },
      },
      {
        returnDocument: "after",
      }
    );
    res.status(200).json({ user: mainUser, post: updatedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "destin.dicki@ethereal.email",
    pass: "envqm5UjaM6PzbWvV",
  },
});
const sendOTPVerificationEmail = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailoptions = {
      from: process.env.Auth_Email,
      to: email,
      subject: "Verify your emailid",
      html: `<p>Enter <b>${otp}</b> in the app to verify your Email</p>`,
    };
    const saltrounds = 10;
    const newotpvarification = await new userOTPverification({
      userId: _id,
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 360000,
    });
    await newotpvarification.save();
    await transporter.sendMail(mailoptions);
    return {
      status: "PENDING",
      message: "Verification otp email sent",
      data: {
        userId: _id,
        email,
      },
    };
  } catch (error) {
    throw new Error("Failed to send OTP verification email: " + error.message);
  }
};
