export const validateDireccionData = (req, res, next) => {
  const { id_usuario, calle, ciudad, codigo_postal, pais } = req.body;

  console.log('🏠 Validando datos de dirección:', {
    id_usuario,
    calle,
    ciudad,
    codigo_postal,
    pais,
    types: {
      id_usuario: typeof id_usuario,
      calle: typeof calle,
      ciudad: typeof ciudad,
      codigo_postal: typeof codigo_postal,
      pais: typeof pais
    }
  });

  if (!id_usuario || typeof id_usuario !== 'number') {
    console.log('❌ Error: id_usuario inválido');
    return res.status(400).json({ error: 'id_usuario es obligatorio y debe ser un número' });
  }

  if (!calle || typeof calle !== 'string') {
    console.log('❌ Error: calle inválida');
    return res.status(400).json({ error: 'calle es obligatoria y debe ser un texto' });
  }

  if (!ciudad || typeof ciudad !== 'string') {
    console.log('❌ Error: ciudad inválida');
    return res.status(400).json({ error: 'ciudad es obligatoria y debe ser un texto' });
  }

  if (!codigo_postal || typeof codigo_postal !== 'string') {
    console.log('❌ Error: codigo_postal inválido');
    return res.status(400).json({ error: 'codigo_postal es obligatorio y debe ser un texto' });
  }

  if (!pais || typeof pais !== 'string') {
    console.log('❌ Error: pais inválido');
    return res.status(400).json({ error: 'pais es obligatorio y debe ser un texto' });
  }

  console.log('✅ Validación de dirección exitosa');
  next();
};
