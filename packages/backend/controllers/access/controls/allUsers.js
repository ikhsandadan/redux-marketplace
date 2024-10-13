import UserModel from "../../../models/UserModel.js";

const allUsers = async (_req, res) => {
    try {
        const all = await UserModel.findAll().catch((err) => {
            return res.status(404).json({
                error: err,
                message: "No users found",
                status: 404,
                ok: false,
            });
        });

        return res.status(200).json({
            message: "Successfully retrieved users!",
            status: 200,
            ok: true,
            users: all,
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

export default allUsers;
