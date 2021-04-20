import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server";

import User from "../../models/User.js";
import { validateRegister, validateLogin } from "../../utilities/validators.js";

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "48h" }
  );
}

export default {
  Mutation: {
    async login(parent, args, context, info) {
      const { username, password } = args;
      const { errors, valid } = validateLogin(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found.";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong username or password.";
        throw new UserInputError("Wrong username or password", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(parent, args, context, info) {
      let { username, email, password, confirmPassword } = args.registerInput;
      
      
      //validate user data
      const { valid, errors } = validateRegister(
        username,
        email,
        password,
        confirmPassword
        );
        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }
        
      password = await bcrypt.hash(password, 12);
      
      //make sure user does not allready exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is alredy taken", {
          errors: {
            username: "Username is alredy taken",
          },
        });
      }

      const newUser = new User({
        username,
        email,
        password,
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
