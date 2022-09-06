import UserModel from "../Models/Usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const RegisterUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const { password, username } = req.body;
  const hashedPass = await bcrypt.hash(password, salt);
  req.body.password = hashedPass;

  const newuser = new UserModel(req.body);

  try {
    const olduser = await UserModel.findOne({ username });
    if (olduser) {
      return res.status(400).json("Username Already Exists");
    }
    const user = await newuser.save();
    console.log("user created", user);

    const token = jwt.sign(
      {
        username: user.username,
        id: user._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ user, token });
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const LoginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        return res.status(400).json("Wrong Password");
      } else {
        const token = jwt.sign(
          {
            username: username,
            id: user._id,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );

        return res.status(200).json({ user, token });
      }
    } else {
      return res.status(404).json("User Not Exists");
    }
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};
