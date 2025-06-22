const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const db = require('../db');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


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

    let image_url = null;
    let image_public_id = null;

    // ✅ Si se subió una imagen, súbela a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'inventario_dwear' },
        (error, result) => {
          if (error) throw error;
          image_url = result.secure_url;
          image_public_id = result.public_id;

          // Luego de subir la imagen, insertar en la BD
          return db.sql`
            INSERT INTO products (type, size, color, quantity, price, brand, logo_type, image_url, image_public_id)
            VALUES (${type}, ${size}, ${color}, ${quantity}, ${price}, ${brand}, ${logo_type}, ${image_url}, ${image_public_id})
          `.then(() => {
            res.json({ success: true, message: 'Producto agregado con imagen' });
          });
        }
      );

      result.end(req.file.buffer); // ← sube desde buffer
      return;
    }

    // Si no hay imagen, solo inserta el producto
    await db.sql`
      INSERT INTO products (type, size, color, quantity, price, brand, logo_type)
      VALUES (${type}, ${size}, ${color}, ${quantity}, ${price}, ${brand}, ${logo_type})
    `;
    res.json({ success: true, message: 'Producto agregado sin imagen' });

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
