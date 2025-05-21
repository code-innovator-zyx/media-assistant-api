import { Router } from "express";
import { MarkdownController } from "@/controllers/markdown.controller.js";

const markdownRouter = Router();
const controller = MarkdownController.getInstance();

markdownRouter.post("/html", controller.convertToHtml);
markdownRouter.get("/preview", controller.preview);

export { markdownRouter };
