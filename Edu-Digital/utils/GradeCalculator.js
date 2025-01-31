export const CalculateGpa = (courses) => {
    let totalPoints = 0;
    let totalCredits = 0;
    const grades = [];
  
    courses.forEach(course => {
      const { mark, credithr } = course;
      let grade = 'F';
      let points = 0;
  
      if (mark >= 95) {
        grade = 'A+';
        points = 4.0;
      } else if (mark >= 85) {
        grade = 'A';
        points = 4.0;
      } else if (mark >= 80) {
        grade = 'A-';
        points = 3.75;
      } else if (mark >= 75) {
        grade = 'B+';
        points = 3.5;
      } else if (mark >= 70) {
        grade = 'B';
        points = 3.0;
      } else if (mark >= 65) {
        grade = 'B-';
        points = 2.75;
      } else if (mark >= 60) {
        grade = 'C+';
        points = 2.5;
      } else if (mark >= 55) {
        grade = 'C';
        points = 2.0;
      } else if (mark >= 50) {
        grade = 'C-';
        points = 1.75;
      } else if (mark >= 45) {
        grade = 'D';
        points = 1;
      } 
      else {
        grade = 'F';
        points = 0.0;
      }
  
      grades.push(grade);
      totalPoints += points * credithr;
      totalCredits += credithr;
    });
  
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    return { gpa, grades };
  };