import { query } from "../database/db.js";

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
