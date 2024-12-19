const { User } = require("../models/user");
const { Post } = require("../models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploadProfileImage, updateProfileImage } = require("../utils/s3");

exports.register = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    if (!fullName || !username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(401).json({
        message: "Try different email",
        success: false,
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(401).json({
        message: "Try different username",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Server error during registration",
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
      bookmarks: user.bookmarks,
    };
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        username: user.username,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId);
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (req.file) {
      try {
        let s3Response;
        if (user.profilePicture) {
          const oldImageKey = user.profilePicture.split(".com/")[1];
          s3Response = await updateProfileImage(
            user.username,
            oldImageKey,
            req.file.buffer,
            req.file.originalname
          );
        } else {
          s3Response = await uploadProfileImage(
            req.file.buffer,
            req.file.originalname,
            user.username
          );
        }
        user.profilePicture = s3Response.Location;
      } catch (error) {
        console.error("S3 upload error:", error);
        return res.status(500).json({
          message: "Error uploading profile picture",
          success: false,
        });
      }
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Edit profile error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

exports.getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.follow = async (req, res) => {
  try {
    const followerId = req.id;
    const followingId = req.params.id;
    if (followerId === followingId) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(followerId);
    const targetUser = await User.findById(followingId);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }
    const isFollowing = user.following.includes(followingId);
    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: followerId },
          { $pull: { following: followingId } }
        ),
        User.updateOne(
          { _id: followingId },
          { $pull: { followers: followerId } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: followerId },
          { $push: { following: followingId } }
        ),
        User.updateOne(
          { _id: followingId },
          { $push: { followers: followerId } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "followed successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
