// MonthSelector.js
import React, { useState } from 'react';

const MonthSelector = ({ onMonthChange }) => {
  const [selectedMonth, setSelectedMonth] = useState('03'); // Default to March

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
    onMonthChange(month);
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div>
      <label>
        Select Month:
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default MonthSelector;
