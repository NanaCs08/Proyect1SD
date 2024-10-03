import fs from 'fs';
import path from 'path';

const aerolineasPath = path.join(process.cwd(), 'data', 'aerolineas');

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  switch (method) {
    case 'GET': {
      // Obtener lista completa de aerolíneas
      const files = fs.readdirSync(aerolineasPath);
      const aerolineas = files.map((file) => {
        const data = fs.readFileSync(path.join(aerolineasPath, file), 'utf-8');
        return JSON.parse(data);
      });
      return aerolineas;
    }

    case 'POST': {
      // Crear una nueva aerolínea
      const newAerol = await readBody(event);
      const newId = `aerolinea_${Date.now()}.json`; // Genera un nombre de archivo único
      fs.writeFileSync(path.join(aerolineasPath, newId), JSON.stringify(newAerol, null, 2));
      return { message: 'Aerolinea creada', data: newAerol };
    }

    default:
      throw createError({ statusCode: 405, message: 'Método no permitido' });
  }
});
