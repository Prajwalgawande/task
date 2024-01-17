import './App.css'
import TransactionsTable from './Components/TransactionTable'
import TransactionStatistics from './Components/TransactionStatistics'
import TransactionsBarChart from './Components/TransactionsBarChart '
function App() {

  return (
    <>
     <h1>Transactions Table</h1>
      <TransactionsTable />
      <TransactionStatistics />
      <TransactionsBarChart/>
    </>
  )
}

export default App
