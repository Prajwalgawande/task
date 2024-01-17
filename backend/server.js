const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

mongoose.connect('mongodb://localhost:27017/products');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  sold: { type: Boolean, default: false },
  dateOfSale: { type: Date },
});

const Product = mongoose.model('Product', productSchema);

app.get('/initialize-database', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const seedData = response.data;
    console.log("length-----------",seedData.length)
    await Product.insertMany(seedData);

    res.json({ success: true, message: 'Database initialized with seed data' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
// ... (previous code)

// API to list all transactions with search and pagination
app.get('/list-transactions', async (req, res) => {
    try {
      const { month,page = 1, perPage = 10, search = '' } = req.query;

      console.log("search",search)
      const query = search
        ? {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
            ],
            $expr: {
              $and: [
                { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] },
                { $eq: ['$sold', true] },
              ],
            },
          }
        : {
          $expr: {
            $and: [
              { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] },
            ],
          }
        };
  
      const transactions = await Product.find(query)
        .skip((page - 1) * perPage)
        .limit(Number(perPage));
  
      res.json({ success: true, transactions });
    } catch (error) {
      console.error('Error listing transactions:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  // API for statistics
  app.get('/statistics', async (req, res) => {
    try {
      const { month } = req.query;
  
      const totalSaleAmount = await Product.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] },
                { $eq: ['$sold', true] },
              ],
            },
          },
        },
        { $group: { _id: null, totalAmount: { $sum: '$price' } } },
      ]);
  
      const totalSoldItems = await Product.countDocuments({
        $expr: {
          $and: [
            { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] },
            { $eq: ['$sold', true] },
          ],
        },
      });
      const totalNotSoldItems = await Product.countDocuments({
        $expr: {
          $and: [
            { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] },
            { $eq: ['$sold', false] },
          ],
        },
      });
  
      res.json({
        success: true,
        totalSaleAmount: totalSaleAmount.length ? totalSaleAmount[0].totalAmount : 0,
        totalSoldItems,
        totalNotSoldItems,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  
  // API for pie chart
  app.get('/bar-chart', async (req, res) => {
    try {
      const { month } = req.query;
      const parsedMonth = parseInt(month);
      const priceRanges = [
        { min: 0, max: 100 },
        { min: 101, max: 200 },
        { min: 201, max: 300 },
        { min: 301, max: 400 },
        { min: 401, max: 500 },
        { min: 501, max: 600 },
        { min: 601, max: 700 },
        { min: 701, max: 800 },
        { min: 801, max: 900 },
        { min: 901, max: Infinity },
      ];
  
      const barChartData = await Promise.all(
        priceRanges.map(async (range) => {
          const startOfMonth = new Date(new Date().getFullYear(), parsedMonth - 1, 1);
          const endOfMonth = new Date(new Date().getFullYear(), parsedMonth, 1);
  
          const itemCount = await Product.countDocuments({
            $expr: {
          $and: [
            { $eq: [{ $month: '$dateOfSale' }, parseInt(month)] },
          ],
        },
            price: { $gte: range.min, $lt: range.max },
          });
  
          return { range, itemCount };
        })
      );
  
      res.json({ success: true, barChartData });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
  
  
  // Combined API
  app.get('/combined-data', async (req, res) => {
    try {
      const { month } = req.query;
  
      const [transactions, statistics, barChart, pieChart] = await Promise.all([
        axios.get(`http://localhost:${PORT}/list-transactions?month=${month}`),
        axios.get(`http://localhost:${PORT}/statistics?month=${month}`),
        axios.get(`http://localhost:${PORT}/bar-chart?month=${month}`),
        axios.get(`http://localhost:${PORT}/pie-chart?month=${month}`),
      ]);
  
      res.json({
        success: true,
        transactions: transactions.data,
        statistics: statistics.data,
        barChart: barChart.data,
        pieChart: pieChart.data,
      });
    } catch (error) {
      console.error('Error fetching combined data:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running`);
});
