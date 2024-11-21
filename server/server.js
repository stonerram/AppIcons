require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 1814;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema & Model
const appSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

const App = mongoose.model('App', appSchema);

// Routes
app.post('/save-app', async (req, res) => {
  const { name, image, description } = req.body;
  try {
    const newApp = new App({ name, image, description });
    await newApp.save();
    res.status(200).json({ message: 'App saved successfully', app: newApp });
  } catch (error) {
    res.status(500).json({ message: 'Error saving app', error });
  }
});

app.get('/get-apps', async (req, res) => {
  try {
    const apps = await App.find();
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching apps', error });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
