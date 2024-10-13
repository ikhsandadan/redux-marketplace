import ItemModel from "../../../models/ItemModel.js";
import UserModel from "../../../models/UserModel.js";
import { Op } from "sequelize";

const loadUserBuyItems = async (req, res) => {
    try {
        const { username: buyerUserName } = req.params;
        console.log(`Finding user with username: ${buyerUserName}`);
        const user = await UserModel.findOne({
            where: { username: buyerUserName },
            attributes: { exclude: ["salt", "password"] },
        });

        if (!user) {
            return res.status(404).json({
                error: "User does not exist",
                ok: false,
                status: 404,
            });
        }

        console.log(`Finding items bought by user with ID: ${user.id}`);
        const allBoughtItems = await ItemModel.findAll({
            where: {
                buyers: {
                [Op.like]: `%${user.id}%`,
                },
            },
        });

        if (!allBoughtItems || allBoughtItems.length === 0) {
            return res.status(400).json({
                error: "User has not bought any items!",
                message: "Empty resource",
                status: 400,
                ok: false,
            });
        }

        console.log(`Found ${allBoughtItems.length} items bought by user.`);
        return res.status(200).json({
            message: "Successfully retrieved user bought items!",
            status: 200,
            ok: true,
            buyer: buyerUserName,
            buyerId: user.id,
            items: allBoughtItems,
        });
    } catch (err) {
        console.error(`Error retrieving bought items: ${err}`);
        return res.status(503).json({
            error: "Internal server error",
            message: err.message,
            status: 503,
            ok: false,
        });
    }
};

export default loadUserBuyItems;