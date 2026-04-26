import { query } from "../database/db.js";
import { redis } from "../config/redis.js";

export const getLiveAssignment = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { subject } = req.query;

    const sub = subject; // If Student Doesnot Pass Subject
    const cacheKey = `live:${teacherId}:${sub}`;

    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // DB fetch
    let contents;
    const currentTime = new Date();
    if (sub) {
      contents = await query(
        `SELECT * FROM content
       WHERE uploaded_by = ?
       AND subject = ?
       AND status = 'approved'
       AND ? BETWEEN start_time AND end_time`,
        [teacherId, sub, currentTime],
      );
    } else {
      contents = await query(
        `SELECT * FROM content
       WHERE uploaded_by = ?
       AND status = 'approved'
       AND ? BETWEEN start_time AND end_time`,
        [teacherId, currentTime],
      );
    }

    if (!contents.length) {
      return res.json({ message: "No content available" });
    }

    // Rotation logic
    const duration = (contents[0].duration || 5) * 60 * 1000; // Default 5 min

    const startTime = new Date(contents[0].start_time).getTime();
    const elapsed = Date.now() - startTime;

    const index = Math.floor(elapsed / duration) % contents.length;

    const active = contents[index];

    const response = {
      id: active.id,
      title: active.title,
      subject: active.subject,
      file: active.file_path,
    };

    // Redis Store
    await redis.set(cacheKey, JSON.stringify(response), "EX", 60); // TTL 60 sec

    return res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
