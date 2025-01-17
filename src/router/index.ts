import express from "express";
import { markdownRouter } from "@/router/markdown.js";

const router = express.Router();

router.use("/md", markdownRouter);

export { router }
