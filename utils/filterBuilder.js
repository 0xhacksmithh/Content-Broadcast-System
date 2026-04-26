export const buildFilters = (query) => {
  const filters = [];
  const values = [];

  if (query.subject) {
    filters.push("subject = ?");
    values.push(query.subject);
  }

  if (query.teacherId) {
    filters.push("uploaded_by = ?");
    values.push(query.teacherId);
  }

  if (query.status) {
    filters.push("status = ?");
    values.push(query.status);
  }

  return {
    where: filters.length ? "WHERE " + filters.join(" AND ") : "",
    values,
  };
};
