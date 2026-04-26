import { query } from "../database/db.js";
import { buildFilters } from "../utils/filterBuilder.js";

// Get Pending Content
export const getPendingContent = async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM content WHERE status = 'pending'",
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dynamic Controller
export const getContent = async (req, res) => {
  try {
    const { where, values } = buildFilters(req.query);
    // console.log(where);
    // console.log(values);

    let sql = `SELECT * FROM content ${where} ORDER BY created_at DESC`;

    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 3);

    // sql += " LIMIT ? OFFSET ?";
    // values.push(limit, (page - 1) * limit);
    const offset = (page - 1) * limit;

    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    console.log(`Query is ${sql}`);
    console.log(`Values ${values}`);

    // console.log("isArray:", Array.isArray(values));
    // console.log("values:", values);
    // console.log(
    //   "types:",
    //   values.map((v) => typeof v),
    // );

    const data = await query(sql, values);

    // console.log(data);

    res.json(data);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Approve Content
export const approveContent = async (req, res) => {
  try {
    const { id } = req.params;

    await query(
      `UPDATE content
       SET status = 'approved',
           approved_by = ?,
           approved_at = NOW()
       WHERE id = ?`,
      [req.user.id, id],
    );

    res.json({ message: "Content approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject Content
export const rejectContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }

    await query(
      `UPDATE content
       SET status = 'rejected',
           rejection_reason = ?
       WHERE id = ?`,
      [reason, id],
    );

    res.json({ message: "Content rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
