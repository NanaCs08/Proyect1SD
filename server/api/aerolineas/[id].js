import fs from 'fs';
import path from 'path';

const aerolineasPath = path.join(process.cwd(), 'data', 'aerolineas');

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const filePath = path.join(aerolineasPath, `aerolinea_${id}.json`);

  const method = getMethod(event);

  switch (method) {
    case 'GET': {
      // Obtener una aerolínea por ID
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
      } else {
        throw createError({ statusCode: 404, message: 'Aerolinea no encontrada' });
      }
    }

    case 'PUT': {
      // Actualizar una aerolínea
      const updatedData = await readBody(event);
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
      return { message: 'Aerolinea actualizada', data: updatedData };
    }

    case 'DELETE': {
      // Eliminar una aerolínea
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return { message: 'Aerolinea eliminada' };
      } else {
        throw createError({ statusCode: 404, message: 'Aerolinea no encontrada' });
      }
    }

    default:
      throw createError({ statusCode: 405, message: 'Método no permitido' });
  }
});
