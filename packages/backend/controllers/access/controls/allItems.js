import ItemModel from "../../../models/ItemModel.js";

const allItems = async (_req, res) => {
	try {
		const all = await ItemModel.findAll().catch((err) => {
			return res.status(404).json({
				error: err,
				message: "No items found",
				status: 404,
				ok: false,
			});
		});

		return res.status(200).json({
			message: "Successfully updated Items!",
			status: 200,
			ok: true,
			items: all,
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

export default allItems;