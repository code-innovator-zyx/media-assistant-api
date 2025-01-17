import express from "express";
import { markdownRouter } from "@/router/markdown";

const router = express.Router();

router.use("/md", markdownRouter);

export { router }
