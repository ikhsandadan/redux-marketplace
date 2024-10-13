import ItemModel from "../../../models/ItemModel.js";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

const buyItem = async (req, res) => {
  try {
    const token = req.signedCookies["advanced-state-management-user"];
    const user = jwt.verify(token, config.TOKEN);
    const buyerUserName = user.username ?? null;
    const buyerId = user.userId ?? null;

    if (!buyerUserName || !buyerId) {
      return res.status(401).json({
        error: "Unauthorized or cookie has expired",
        status: 401,
        ok: false,
      });
    }

    const { id: itemId, sellerId, title, quantity } = req.body;
    if (!itemId || !sellerId || !quantity) {
      return res.status(400).json({
        error: "Malformed Input. Invalid Request",
        message: "One or more of the inputs are empty",
        status: 400,
        ok: false,
      });
    }

    const item = await ItemModel.findOne({
      where: { id: itemId, sellerId: sellerId, title: title },
    });

    if (!item) {
      return res.status(404).json({
        error: "Item not found",
        message: "The specified item does not exist",
        status: 404,
        ok: false,
      });
    }

    if (item.quantity < quantity) {
      return res.status(400).json({
        error: "Insufficient Quantity",
        message: "The quantity requested exceeds the available quantity",
        status: 400,
        ok: false,
      });
    }

    item.quantity -= quantity;

    // Update buyers array
    if (item.buyers === null || item.buyers === "") {
        item.buyers = buyerId.toString();
    } else (
        item.buyers += "," + buyerId.toString()
    )

    item.updatedAt = new Date();

    if (item.quantity === 0) {
      item.status = "sold";
    }

    await item.save();

    console.log("Updated buyers:", item.buyers);

    return res.status(200).json({
      message: "Successfully bought item!",
      status: 200,
      ok: true,
    });
  } catch (err) {
    console.error(`Error processing buy item request: ${err}`);
    return res.status(503).json({
      error: "Internal server error",
      message: err.message,
      status: 503,
      ok: false,
    });
  }
};

export default buyItem;
