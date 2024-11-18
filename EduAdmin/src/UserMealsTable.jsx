import { useState } from "react";

/* eslint-disable react/prop-types */
export default function UserMealsTable({ data }) {
  const [filterDate, setFilterDate] = useState(""); // State to hold the selected filter date

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(); // format like "MM/DD/YYYY"
  };

  // Function to handle date input changes
  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  // Function to filter data by the selected date
  const filterDataByDate = (data) => {
    if (!filterDate) return data; // if no filter date is selected, return all data

    // Filter the data based on the selected date (ignores time)
    return data.filter((item) => {
      const itemDate = new Date(item.Date).toLocaleDateString();
      return itemDate === new Date(filterDate).toLocaleDateString();
    });
  };

  // Filtered data based on the selected date
  const filteredData = filterDataByDate(data);

  // Inline style objects
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
    filterLabel: {
      display: "block",
      fontSize: "16px",
      marginBottom: "10px",
      color: "#555",
      textAlign: "center",
    },
    dateInput: {
      padding: "8px",
      fontSize: "16px",
      marginLeft: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      outline: "none",
      transition: "border 0.3s",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    thead: {
      backgroundColor: "blue",
      color: "white",
    },
    ttext: {
      textAlign: "center",
      padding: "12px",
      border: "1px solid #ddd",
      fontSize: "18px",
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
    rowHover: {
      backgroundColor: "#f1f1f1",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Daily Meals Report</h2>

      {/* Date filter input */}
      <label style={styles.filterLabel}>
        Filter by Date:
        <input
          type="date"
          style={styles.dateInput}
          value={filterDate}
          onChange={handleDateChange}
        />
      </label>

      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.ttext}>User ID</th>
            <th style={styles.ttext}>Date</th>
            <th style={styles.ttext}>Breakfast</th>
            <th style={styles.ttext}>Lunch</th>
            <th style={styles.ttext}>Dinner</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((item, index) => (
            <tr
              key={item._id}
              style={index % 2 === 0 ? styles.rowEven : undefined}
            >
              <td style={styles.thTd}>{item.user}</td>
              <td style={styles.thTd}>{formatDate(item.Date)}</td>
              <td style={styles.thTd}>{item.BreakFast ? "✓" : "✗"}</td>
              <td style={styles.thTd}>{item.Lunch ? "✓" : "✗"}</td>
              <td style={styles.thTd}>{item.Dinner ? "✓" : "✗"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
