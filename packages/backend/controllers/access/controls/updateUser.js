import UserModel from "../../../models/UserModel.js";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

const updateUser = async (req, res) => {
    try {
        const token = req.signedCookies["advanced-state-management-user"];
        const user = jwt.verify(token, config.TOKEN);
        const requesterRole = user.role ?? null;
        const requesterId = user.userId ?? null;

        if (!requesterRole || !requesterId) {
            return res.status(401).json({
                error: "Unauthorized or cookie has expired",
                status: 401,
                ok: false,
            });
        }

        // Only allow update if the requester is admin or updating their own profile
        const { id: userId, username, email, password, role } = req.body;
        if (requesterRole !== "admin" && requesterId === userId) {
            return res.status(403).json({
                error: "Forbidden",
                message: "You are not authorized to update this user",
                status: 403,
                ok: false,
            });
        }

        if (!userId || !username || !email || !password || !role) {
            return res.status(400).json({
                error: "Malformed Input. Invalid Request",
                message: "One or more of the inputs are empty",
                status: 400,
                ok: false,
            });
        }

        const userToUpdate = await UserModel.findOne({
            where: {
                id: userId,
            },
        });

        if (!userToUpdate) {
            return res.status(404).json({
                error: "Not Found",
                message: "User not found",
                status: 404,
                ok: false,
            });
        }

        userToUpdate.username = username;
        userToUpdate.email = email;
        userToUpdate.role = role;
        userToUpdate.updatedAt = Date.now();

        await userToUpdate.save();

        return res.status(200).json({
            message: "Successfully updated user!",
            status: 200,
            ok: true,
        });
    } catch (err) {
        return res.status(503).json({
            error: "Internal server error",
            message: err,
            status: 503,
            ok: false,
        });
    }
};

export default updateUser;
