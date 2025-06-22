const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const db = require('../db');

// ===================== GET =====================
router.get('/', async (req, res) => {
  try {
    const result = await db.sql`SELECT * FROM products;`;
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al obtener productos' });
  }
});

// ===================== POST =====================
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      type,
      size,
      color,
      quantity,
      price,
      brand,
      logo_type
    } = req.body;

    await db.sql`
      INSERT INTO products (type, size, color, quantity, price, brand, logo_type)
      VALUES (${type}, ${size}, ${color}, ${quantity}, ${price}, ${brand}, ${logo_type})
    `;

    res.json({ success: true, message: 'Producto agregado correctamente' });

  } catch (err) {
    console.error('❌ Error al insertar producto:', err);
    res.status(500).json({ success: false, message: 'Error al insertar producto' });
  }
});

// ===================== PUT =====================
// Actualiza producto por ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      size,
      color,
      quantity,
      price,
      brand,
      logo_type
    } = req.body;

    await db.sql`
      UPDATE products
      SET type = ${type},
          size = ${size},
          color = ${color},
          quantity = ${quantity},
          price = ${price},
          brand = ${brand},
          logo_type = ${logo_type}
      WHERE id = ${id}
    `;

    res.json({ success: true, message: 'Producto actualizado correctamente' });

  } catch (err) {
    console.error('❌ Error al actualizar producto:', err);
    res.status(500).json({ success: false, message: 'Error al actualizar producto' });
  }
});

// ===================== DELETE =====================
// Elimina producto por ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.sql`
      DELETE FROM products WHERE id = ${id}
    `;

    res.json({ success: true, message: 'Producto eliminado correctamente' });

  } catch (err) {
    console.error('❌ Error al eliminar producto:', err);
    res.status(500).json({ success: false, message: 'Error al eliminar producto' });
  }
});

module.exports = router;
