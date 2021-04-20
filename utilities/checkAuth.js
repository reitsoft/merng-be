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
    return jwt.verify(token, "dsk4fjgh4bsg5gchj98kg0cjh");
  } catch (error) {
    throw new AuthenticationError("Invalid token", error);
  }
};
