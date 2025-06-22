require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./routes/products');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', require('./routes/products'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
