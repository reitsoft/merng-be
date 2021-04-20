import validator from "validator";

export const validateRegister = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (validator.isEmpty(username)) {
    errors.username = "Username must not be empty.";
  }

  if (validator.isEmpty(email)) {
    errors.email = "Email must not be empty.";
  } else if (!validator.isEmail(email)) {
    errors.email = "Email must be a valid email adress.";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Password must not be empty.";
  } else if (!validator.equals(confirmPassword, password)) {
    errors.confirmPassword = "Passwords must match.";
  }

  return { errors, valid: Object.keys(errors).length < 1 };
};

export const validateLogin = (username, password) => {
  const errors = {};

  if (validator.isEmpty(username)) {
    errors.username = "Username must not be empty.";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Password must not be empty.";
  }

  return { errors, valid: Object.keys(errors).length < 1 };
};

export const validatePostInput = (inputText) => {
  const errors = {};

  if (validator.isEmpty(inputText)) {
    errors.inputText = "Post must not be empty.";
  }

  return { errors, valid: Object.keys(errors).length < 1 };
}
