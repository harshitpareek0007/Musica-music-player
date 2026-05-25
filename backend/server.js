require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./db');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
