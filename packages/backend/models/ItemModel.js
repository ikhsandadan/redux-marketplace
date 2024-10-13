import { DataTypes, Model } from "sequelize";
import { sequelizeItems } from "../database/db.js";

class ItemModel extends Model {}
ItemModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		sellerId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		sellerUserName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
        quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
        description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
        image: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		buyers: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize: sequelizeItems,
		modelName: "items",
	},
);

export default ItemModel;
