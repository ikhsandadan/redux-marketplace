import ItemModel from "../../../models/ItemModel.js";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

const updateItem = async (req, res) => {
    try {
        const token = req.signedCookies["advanced-state-management-user"];
        const user = jwt.verify(token, config.TOKEN);
        const sellerUserName = user.username ?? null;
        const sellerId = user.userId ?? null;

        if (!sellerUserName || !sellerId) {
            return res.status(401).json({
                error: "Unauthorized or cookie has expired",
                status: 401,
                ok: false,
            });
        }

        const { id: itemId, title, price, quantity, description, image, status } = req.body;
        if (!itemId || !title || !price || !quantity || !description || !image || !status) {
            return res.status(400).json({
                error: "Malformed Input. Invalid Request",
                message: "One or more of the inputs are empty",
                status: 400,
                ok: false,
            });
        }

        const item = await ItemModel.findOne({
            where: { id: itemId, sellerId: sellerId },
        });

        item.title = title;
        item.price = price;
        item.quantity = quantity;
        item.description = description;
        item.image = image;
        item.status = status;
        item.updatedAt = Date.now();

        await item.save();

        return res.status(200).json({
            message: "Successfully updated item!",
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

export default updateItem;