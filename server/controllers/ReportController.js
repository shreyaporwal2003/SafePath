import axios from "axios";
import Report from "../models/Report.model.js";
import fs from "fs";
import FormData from "form-data";

export const ReportController = {
    register: async (req, res) => {
        const { name, description, latitude, longitude, user_id } = req.body;
        try {
            const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

            const report = new Report({
                name,
                description,
                photo: photoPath,
                location: {
                    latitude,
                    longitude,
                },
                user_id,
                detections: [],
            });

            await report.save();

            if (photoPath) {
                let threshold = 0.5;
                const path = req.file.path.replace(/\\/g, "/");

                if (!fs.existsSync(path)) {
                    console.error("File not found:", path);
                    return res.status(400).json({ error: "File not found" });
                }

                const formData = new FormData();
                formData.append("file", fs.createReadStream(path));
                formData.append("threshold", threshold);

                const detectionResponse = await axios.post(
                    "http://127.0.0.1:8000/upload_frame/",
                    formData,
                    {
                        headers: formData.getHeaders(), // Let FormData set the correct headers
                    }
                );

                if (detectionResponse.data.detections) {
                    report.detections = detectionResponse.data.detections.map((detection) => ({
                        damage_type: detection.label,
                        confidence_score: detection.score,
                        bounding_box: detection.box,
                    }));

                    await report.save();
                }
            }

            res.status(201).json({ report, message: "Report registered successfully!" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    getAllReports: async (req, res) => {
        try {
            const reports = await Report.find();
            res.status(200).json(reports);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getReportById: async (req, res) => {
        const { id } = req.params;
        try {
            const report = await Report.findById(id);
            if (!report) {
                return res.status(404).json({ error: "Report not found" });
            }
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getReportByUserId: async (req, res) => {
        const { user_id } = req.params;
        try {
            const report = await Report.find({ user_id });
            if (!report) {
                return res.status(404).json({ error: "Report not found" });
            }
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteReport: async (req, res) => {
        const { id } = req.params;
        try {
            const report = await Report.findByIdAndDelete(id);
            if (!report) {
                return res.status(404).json({ error: "Report not found" });
            }
            res.status(200).json({ message: "Report deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};