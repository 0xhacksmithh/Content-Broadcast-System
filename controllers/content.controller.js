import { query } from "../database/db.js";

// Upload Content
export const uploadContent = async (req, res) => {
  try {
    const { title, description, subject, start_time, end_time, duration } =
      req.body;

    if (!title || !subject || !req.file) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Insert content
    const result = await query(
      `INSERT INTO content 
      (title, description, subject, file_path, file_type, file_size, uploaded_by, status, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [
        title,
        description,
        subject,
        req.file.path,
        req.file.mimetype,
        req.file.size,
        req.user.id,
        start_time ? new Date(start_time) : new Date(), // We Required Start and End Time
        end_time ? new Date(end_time) : new Date(Date.now() + 30 * 60 * 1000), // Default  30 min for now
      ],
    );

    const contentId = result.insertId;

    // Optional schedule insert
    if (duration) {
      await query(
        `INSERT INTO content_schedule (content_id, duration, rotation_order)
         VALUES (?, ?, ?)`,
        [contentId, duration, 1],
      );
    }

    res.json({ "contentID :: ": contentId });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get Teacher's Content
export const getMyContent = async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM content WHERE uploaded_by = ? ORDER BY created_at DESC",
      [req.user.id],
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
