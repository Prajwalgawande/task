import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { months } from './month';
const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('03');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/list-transactions?month=${selectedMonth}&page=${currentPage}&search=${searchText}`);
      
      setTransactions(response.data.transactions);
      console.log(response.data.transactions)
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
 

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = () => {
    fetchTransactions();
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, searchText, currentPage]);

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
      <input type="text" value={searchText} onChange={handleSearchChange} placeholder="Search Transaction" />
      <button onClick={handleSearch}>Search</button>

      <table>
        {/* Table headers */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>price</th>
            <th>category</th>
            <th>sold</th>
            <th>image</th>
            {/* Add more headers as needed */}
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {transactions && transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.price}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold?"Sold":"Not Sold"}</td>
              <td><img src={transaction.image} style={{"height":"50px"}} alt="" /></td>

              {/* Add more cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>

      <div className='navigation'>
        <button onClick={handlePreviousPage}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
      
    </div>
  );
};

export default TransactionsTable;
