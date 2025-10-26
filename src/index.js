import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import carritoRoutes from './routes/carrito.js';
import pedidoRoutes from './routes/pedido.js';
import itemCarritoRoutes from './routes/itemCarrito.js';
import direccionRoutes from './routes/direccion.js';
import pagoRoutes from './routes/pago.js';


import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/users', userRoutes);
app.use('/carrito', carritoRoutes);
app.use('/pedido', pedidoRoutes);
app.use('/itemcarrito', itemCarritoRoutes);
app.use('/direccion', direccionRoutes);
app.use('/pago', pagoRoutes);


app.get('/', (req, res) => {
  res.send('API de Usuarios funcionando 🚀. Visita /users para ver los datos.');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
