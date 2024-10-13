import { Sequelize } from "sequelize";

const sequelizeItems = new Sequelize({
	database: "items",
	dialect: "sqlite",
	storage: "./database/items.sqlite",
	logging: false,
});

sequelizeItems
	.authenticate()
	.then(async () => {
		await sequelizeItems
			.sync({ alter: true })
			.then(() => console.log("Database is synchronised for items db"));
		console.log("Connection established for items db");
	})
	.catch((err) => console.error("Unable to connect to items database: ", err));

const sequelizeUsers = new Sequelize({
	database: "users",
	dialect: "sqlite",
	storage: "./database/users.sqlite",
	logging: false,
});

sequelizeUsers
	.authenticate()
	.then(async () => {
		await sequelizeUsers
			.sync({ alter: true })
			.then(() => console.log("Database is synchronised for users db"));
		console.log("Connection established for users db");
	})
	.catch((err) => console.error("Unable to connect to users database: ", err));

export { sequelizeItems, sequelizeUsers };
