import express from "express";
import { ReportController } from "../controllers/ReportController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/report/register", upload.single("photo"), ReportController.register);
router.get("/report", ReportController.getAllReports);
router.get("/report/:id", ReportController.getReportById);
router.get("/report/user/:user_id", ReportController.getReportByUserId);
router.delete("/report/:id", ReportController.deleteReport);

export default router;