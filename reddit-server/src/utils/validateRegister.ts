import { UsernamePasswordInput } from "./UsernamePasswordInput";

export const vaildateRegister = (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Cannot include @",
      },
    ];
  }

  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Sorry! Invalid email!",
      },
    ];
  }

  if (options.password.length <= 4) {
    return [
      {
        field: "password",
        message: "length must be greater than 4",
      },
    ];
  }

  return null;
};
