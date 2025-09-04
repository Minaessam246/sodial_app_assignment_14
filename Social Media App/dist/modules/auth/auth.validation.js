"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const zod_1 = require("zod");
exports.signup = {
    body: zod_1.z
        .strictObject({
        username: zod_1.z.string().min(3),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        confirmPassword: zod_1.z.string(),
        role: zod_1.z.string().optional(),
    })
        .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Password and confirm password do not match",
                path: ["confirmPassword"],
            });
        }
    }),
};
exports.login = {
    body: zod_1.z.strictObject({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }),
};
