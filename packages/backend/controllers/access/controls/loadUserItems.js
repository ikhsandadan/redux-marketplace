import ItemModel from "../../../models/ItemModel.js";
import UserModel from "../../../models/UserModel.js";

const loadUserItems = async (req, res) => {
    try {
        const { username: sellerUserName } = req.params;
        const user = await UserModel.findOne({
            where: { username: sellerUserName },
            attributes: { exclude: ["salt", "password"] },
        });

        if (!user) {
            return res.status(404).json({
                error: "User does not exist",
                ok: false,
                status: 404,
            });
        }

        const allItems = await ItemModel.findAll({
            where: { sellerUserName: sellerUserName },
        }).catch((err) => console.error(`Failed to find all items with ${err}`));

        if (!allItems) {
            return res.status(400).json({
                error: "User has not listed any items!",
                message: "Empty resource",
                status: 400,
                ok: false,
            });
        }

        return res.status(200).json({
            message: "Successfully retrieved user items!",
            status: 200,
            ok: true,
            seller: sellerUserName,
            sellerId: user.id,
            items: allItems,
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

export default loadUserItems;
