"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.getLoginCredentials = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const jsonwebtoken_2 = require("jsonwebtoken");
const nanoid_1 = require("nanoid");
const generateToken = ({ payload, secret, options }) => {
    return (0, jsonwebtoken_1.sign)(payload, secret, options);
};
exports.generateToken = generateToken;
const detectSignatureLevel = (role) => {
    let signatureLevel;
    if (role == "admin") {
        signatureLevel = "System";
    }
    else {
        signatureLevel = "Bearer";
    }
    return signatureLevel;
};
const getSignatures = (signatureLevel) => {
    var signatures = { access_Signature: "", refresh_Signature: "" };
    if (signatureLevel == "Bearer") {
        signatures = { access_Signature: "userAccessSiganture", refresh_Signature: "userRefreshSiganture" };
    }
    else if (signatureLevel == "System") {
        signatures = { access_Signature: "adminAccessSiganture", refresh_Signature: "adminRefreshSiganture" };
    }
    return signatures;
};
const getLoginCredentials = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        timestamp: Date.now(),
    };
    var credentials = {
        accessToken: "", refreshToken: ""
    };
    const signatureLevel = detectSignatureLevel(user.role);
    const sigantures = getSignatures(signatureLevel);
    console.log(signatureLevel, sigantures);
    const jwtid = (0, nanoid_1.customAlphabet)("123456789abcdfghi", 12)();
    credentials.accessToken = (0, exports.generateToken)({ payload: payload, secret: sigantures.access_Signature, options: { expiresIn: "1h", jwtid } });
    credentials.refreshToken = (0, exports.generateToken)({ payload: payload, secret: sigantures.refresh_Signature, options: { expiresIn: "1y", jwtid } });
    console.log(credentials);
    return credentials;
};
exports.getLoginCredentials = getLoginCredentials;
const decodeToken = ({ authorization, tokenType }) => {
    const [key, token] = authorization.split(" ");
    if (!key || !token) {
        return;
    }
    try {
        const signatures = getSignatures(key);
        console.log(signatures, token);
        if (tokenType == "access") {
            return (0, jsonwebtoken_2.verify)(token, signatures.access_Signature);
        }
        else if (tokenType == "refresh") {
            return (0, jsonwebtoken_2.verify)(token, signatures.refresh_Signature);
        }
    }
    catch (error) {
    }
};
exports.decodeToken = decodeToken;
