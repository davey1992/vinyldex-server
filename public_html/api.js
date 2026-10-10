const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

if (!process.env.VINDEX_PEPPER || !process.env.NODE_ENV || !process.env.PORT) {
    throw new Error('Environment is not properly setup.');
}
const PORT = process.env.PORT || 5000;

const express = require('express');
const {log} = require ('./utils/helpers');
const routes = require ('./routes');
const post_tests = require ('./post_tests');

const app = express();

app.use(express.json({ limit: '75kb' }));
app.get('/', (req, res) => {
  res.send('VinDex API is live!');
});

//TO IMPORT ALL ROUTES
app.use('/', routes);

//TEST SHIZZLE
app.use('/', post_tests);

app.listen(PORT, () => {
  log(`Server running on port ${PORT}`);
});