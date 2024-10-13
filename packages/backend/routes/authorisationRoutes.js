import { Router } from "express";
import tokenVerification from "../security/authentication.js";
import allUsers from "../controllers/access/controls/allUsers.js";
import deleteUser from "../controllers/access/controls/deleteUser.js";
import updateUser from "../controllers/access/controls/updateUser.js";
import createItem from "../controllers/access/controls/createItem.js";
import loadUserItems from "../controllers/access/controls/loadUserItems.js";
import deleteItem from "../controllers/access/controls/deleteItem.js";
import updateItem from "../controllers/access/controls/updateItem.js";
import allItems from "../controllers/access/controls/allItems.js";
import buyItem from "../controllers/access/controls/buyItem.js";
import loadUserBuyItems from "../controllers/access/controls/loadUserBuyItems.js";

const accessControlRoutes = Router({ mergeParams: true });

accessControlRoutes.post("/item/create", tokenVerification, (req, res) =>
	createItem(req, res),
);
accessControlRoutes.delete("/item/delete", tokenVerification, (req, res) =>
	deleteItem(req, res),
);
accessControlRoutes.put("/item/buy", tokenVerification, (req, res) =>
	buyItem(req, res),
);
accessControlRoutes.put("/item/update", tokenVerification, (req, res) =>
	updateItem(req, res),
);
accessControlRoutes.get("/item/all", tokenVerification, (req, res) => 
	allItems(req, res)
);
accessControlRoutes.get("/all", tokenVerification, (req, res) => 
	allUsers(req, res)
);
accessControlRoutes.delete("/user/delete", tokenVerification, (req, res) =>
	deleteUser(req, res)
);
accessControlRoutes.put("/user/update", tokenVerification, (req, res) =>
	updateUser(req, res)
);

// no auth needed routes
accessControlRoutes.get("/user/:username", (req, res) =>
	loadUserItems(req, res),
);
accessControlRoutes.get("/buyer/:username", (req, res) =>
	loadUserBuyItems(req, res),
);

export default accessControlRoutes;
