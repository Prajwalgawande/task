// TransactionStatistics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { months } from './month';

const TransactionStatistics = () => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState('03');
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/statistics?month=${selectedMonth}`);
  
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div>
      <h2>Transaction Statistics</h2>
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
      <div>Total Sale Amount: ${statistics.totalSaleAmount.toFixed(2)}</div>
      <div>Total Sold Items: {statistics.totalSoldItems}</div>
      <div>Total Not Sold Items: {statistics.totalNotSoldItems}</div>
    </div>
  );
};

export default TransactionStatistics;
