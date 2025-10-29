import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import carritoRoutes from './routes/carrito.js';
import pedidoRoutes from './routes/pedido.js';
import itemCarritoRoutes from './routes/itemCarrito.js';
import direccionRoutes from './routes/direccion.js';
import pagoRoutes from './routes/pago.js';
import autorRoutes from './routes/autor.js';
import detallePedidoRoutes from './routes/detallePedido.js';
import categoriaRoutes from './routes/categoria.js';
import libroRoutes from './routes/libro.js';


import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

app.use('/users', userRoutes);
app.use('/carrito', carritoRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/itemcarrito', itemCarritoRoutes);
app.use('/direccion', direccionRoutes);
app.use('/pago', pagoRoutes);
app.use('/autor', autorRoutes);
app.use('/detallepedido', detallePedidoRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/libro', libroRoutes);


app.get('/', (req, res) => {
  res.send('API de Usuarios funcionando 🚀. Visita /users para ver los datos.');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
