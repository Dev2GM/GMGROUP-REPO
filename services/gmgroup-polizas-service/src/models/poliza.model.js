const db = require("../config/db");

const Poliza = {
  create: async (data, cb) => {
    const conn = await db.getConnection();
    await conn.beginTransaction();

    try {
      // Insertar Póliza
      const [result] = await conn.query(
      `INSERT INTO Polizas (
          codigo, fecha_inicio, fecha_fin, precio, n_cuotas, prima, referencia,
          id_cobertura, id_moneda, id_metodo, id_auto, id_persona, id_canal, id_corredor
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.codigo,
        data.fecha_inicio.toISOString().slice(0, 10), // YYYY-MM-DD
        data.fecha_fin.toISOString().slice(0, 10),
        data.precio,
        data.n_cuotas,
        data.prima,
        data.referencia,
        data.id_cobertura,
        data.id_moneda,
        data.id_metodo,
        data.id_auto || null, // si no viene, null
        data.id_persona,
        data.id_canal,
        data.id_corredor,
      ]
    );

      console.log(result)
      const polizaId = result.insertId;

      // Calcular distribución de cuotas
      const fechaInicio = new Date(data.fecha_inicio);
      const fechaFin = new Date(data.fecha_fin);
      const nCuotas = data.n_cuotas;
      const valorCuota = parseFloat((data.precio / nCuotas).toFixed(2)); // valor equitativo

      // Diferencia en milisegundos
      const diffTime = fechaFin.getTime() - fechaInicio.getTime();
      const step = diffTime / nCuotas; // intervalo uniforme entre cuotas

      for (let i = 1; i <= nCuotas; i++) {
        const fechaVenc = new Date(fechaInicio.getTime() + step * i);

        await conn.query(
          `INSERT INTO Cuotas (fecha_vencimiento, valor, fecha_pago, id_poliza)
           VALUES (?, ?, NULL, ?)`,
          [fechaVenc.toISOString().slice(0, 10), valorCuota, polizaId]
        );
      }

      await conn.commit();
      cb(null, { id: polizaId });
    } catch (err) {
      await conn.rollback();
      cb(err, null);
    } finally {
      conn.release();
    }
  },
};


module.exports = Poliza;
