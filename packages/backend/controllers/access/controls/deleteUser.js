import UserModel from "../../../models/UserModel.js";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

const deleteUser = async (req, res) => {
    console.log(req.body);
    try {
        const token = req.signedCookies["advanced-state-management-user"];
        const user = jwt.verify(token, config.TOKEN);
        const userRole = user.role ?? null;
        const userId = user.userId ?? null;

        if (userRole !== "admin") {
        return res.status(401).json({
            error: "Unauthorized",
            message: "You do not have permission to perform this action",
            status: 401,
            ok: false,
        });
        }

        const { id: deleteUserId } = req.body;
        if (!deleteUserId) {
        return res.status(400).json({
            error: "Malformed Input",
            message: "User ID cannot be empty",
            status: 400,
            ok: false,
        });
        }

        if (deleteUserId === userId) {
        return res.status(400).json({
            error: "Invalid Request",
            message: "You cannot delete your own account",
            status: 400,
            ok: false,
        });
        }

        const isDeleted = await UserModel.destroy({
        where: { id: deleteUserId },
        });

        if (!isDeleted) {
        return res.status(404).json({
            error: "Not Found",
            message: "Not able to delete the specified user.",
            status: 404,
            ok: false,
        });
        }

        return res.status(200).json({
        message: "Successfully deleted a user!",
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

export default deleteUser;