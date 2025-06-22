const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Configurar CORS para GitHub Pages
app.use(cors({
  origin: 'https://empresascol.github.io',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});
