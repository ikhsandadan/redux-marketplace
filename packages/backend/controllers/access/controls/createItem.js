import ItemModel from "../../../models/ItemModel.js";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

const createItem = async (req, res) => {
    try {
        const token = req.signedCookies["advanced-state-management-user"];
        const user = jwt.verify(token, config.TOKEN);
        const sellerUserName = user.username ?? null;
        const sellerId = user.userId ?? null;

        if (!sellerUserName || !sellerId) {
        return res.status(401).json({
            error: "Unauthorized or cookie has expired",
            message: "Cookie is invalid",
            status: 401,
            ok: false,
        });
        }

        const { title, price, quantity, description, image } = req.body;
        if (!title || !price || !quantity) {
        return res.status(400).json({
            error: "Malformed Input",
            message: "All fields are required",
            status: 400,
            ok: false,
        });
        }

        await ItemModel.create({
            sellerId: sellerId,
            sellerUserName: sellerUserName,
            title: title,
            price: price,
            quantity: quantity,
            description: description,
            image: image,
            status: "available",
            buyers: "",
        });

        return res.status(200).json({
            message: "Successfully created new item!",
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

export default createItem;
