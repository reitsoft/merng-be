import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";

export default (context) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) {
    throw new Error("Authorization header must be provided.");
  }

  const token = authHeader.split("Bearer ")[1];
  if (!token) {
    throw new Error("Authentication token must be 'Bearer [token]'");
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AuthenticationError("Invalid token", error);
  }
};
