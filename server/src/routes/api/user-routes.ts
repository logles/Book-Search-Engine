//authenticateToken changed to getUserFromToken by Lydia

import express from "express";
const router = express.Router();
import {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} from "../../controllers/user-controller.js";

// import middleware
import { getUserFromToken } from "../../services/auth.js"; //authenticateToken changed to getUserFromToken by Lydia

// put authMiddleware anywhere we need to send a token for verification of user
router.route("/").post(createUser).put(getUserFromToken, saveBook);

router.route("/login").post(login);

router.route("/me").get(getUserFromToken, getSingleUser);

router.route("/books/:bookId").delete(getUserFromToken, deleteBook);

export default router;
