import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
export const months = [
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

const BarChartComponent = () => {
  const [selectedMonth, setSelectedMonth] = useState(months[0].value);
  const [barChartData, setBarChartData] = useState([]);
  const chartOptions = {
    scales: {
      y: { type: 'linear', position: 'left' }, // Linear scale for numerical y-axis
    },
  };
  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/bar-chart?month=${selectedMonth}`);
        console.log(response)
        setBarChartData(response.data.barChartData);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };

    fetchBarChartData();
  }, [selectedMonth]);

  const chartData = {
    labels: barChartData.map((range) => `${range.range.min}-${range.range.max}`),
    datasets: [
      {
        label: 'Number of Items',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: barChartData.map((range) => range.itemCount),
      },
    ],
  };


  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div>
      <h2>Transactions Bar Chart</h2>
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
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default BarChartComponent;
