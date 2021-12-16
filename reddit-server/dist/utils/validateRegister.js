"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vaildateRegister = void 0;
const vaildateRegister = (options) => {
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
exports.vaildateRegister = vaildateRegister;
//# sourceMappingURL=validateRegister.js.map