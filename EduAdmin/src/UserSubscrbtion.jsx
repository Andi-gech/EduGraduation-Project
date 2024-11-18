/* eslint-disable react/prop-types */
export default function UserSubscrbtion({ data }) {
  // Function to format the date in "MM/DD/YYYY" format
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(); // format like "MM/DD/YYYY"
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Subscription Information</h2>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.thTd}>User ID</th>
            <th style={styles.thTd}>Location</th>
            <th style={styles.thTd}>Payment Method</th>
            <th style={styles.thTd}>Start Date</th>
            <th style={styles.thTd}>End Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr
              key={item._id}
              style={index % 2 === 0 ? styles.rowEven : undefined}
            >
              <td style={styles.thTd}>{item.user}</td>
              <td style={styles.thTd}>{item.location}</td>
              <td style={styles.thTd}>{item.paymentMethod}</td>
              <td style={styles.thTd}>{formatDate(item.startdate)}</td>
              <td style={styles.thTd}>{formatDate(item.enddate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Inline styles
const styles = {
  container: {
    width: "80%",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  thead: {
    backgroundColor: "#007bff",
    color: "white",
  },
  thTd: {
    textAlign: "center",
    padding: "12px",
    border: "1px solid #ddd",
    fontSize: "18px",
    color: "#333",
  },
  rowEven: {
    backgroundColor: "#f2f2f2",
  },
};
