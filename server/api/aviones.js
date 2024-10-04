import fs from 'fs';
import path from 'path';

// Ruta del directorio donde se encuentran los archivos JSON de los aviones
const dataPath = path.resolve('data/aviones');

const generateSlug = (text) => {
  if (!text || typeof text !== 'string') {
    return ''; // Devuelve un slug vacío si el texto no es válido
  }
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')           // Reemplazar espacios con guiones
    .replace(/[^\w\-]+/g, '')       // Eliminar caracteres no válidos
    .replace(/\-\-+/g, '-')         // Reemplazar múltiples guiones por uno solo
    .replace(/^-+/, '')             // Eliminar guiones al inicio
    .replace(/-+$/, '');            // Eliminar guiones al final
};

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;  // Acceder a req y res en Nuxt 3
  const { method } = req;
  
  // Usa getQuery para obtener los parámetros de consulta
  const { slug } = getQuery(event) || {};  
  console.log("slug", slug);

  try {
    switch (method) {
      case 'GET':
        if (slug) {
          // Buscar un avión específico por el slug
          const filePath = path.join(dataPath, `avion_${slug}.json`);
          console.log(`Buscando archivo: ${filePath}`);
          if (fs.existsSync(filePath)) {
            const airplaneData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.statusCode = 200;
            return airplaneData;  // Devuelve el JSON directamente en Nuxt 3
          } else {
            console.log('Avión no encontrado');
            res.statusCode = 404;
            return { error: 'Avión no encontrado' };
          }
        } else {
          // Leer todos los archivos JSON de aviones
          const files = await fs.promises.readdir(dataPath);

          // Filtrar solo los archivos JSON
          const jsonFiles = files.filter(file => file.endsWith('.json'));

          // Verificar si hay archivos JSON
          if (jsonFiles.length === 0) {
            res.statusCode = 404;
            return { error: 'No hay aviones disponibles' };
          }

          // Leer y parsear todos los archivos JSON de manera asíncrona
          const airplanes = await Promise.all(
            jsonFiles.map(async (file) => {
              const filePath = path.join(dataPath, file);
              console.log(`Leyendo archivo: ${filePath}`);
              const fileData = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
              return fileData;
            })
          );
          
          res.statusCode = 200;
          return airplanes;  // Devolver todos los aviones
        }

      case 'POST':
        // Crear un nuevo avión
        const newAirplane = await readBody(event);
        console.log('Datos recibidos para POST:', newAirplane);

        if (!newAirplane.modelo || !newAirplane.fabricante || !newAirplane.tipo || !newAirplane.capacidad || !newAirplane.velocidad_maxima || !newAirplane.año_lanzamiento || !newAirplane.aerolineas_usuarias || !newAirplane.imagen) {
          console.log('Faltan campos requeridos:', newAirplane);
          res.statusCode = 400;
          return { error: 'Faltan campos requeridos' };
        }
        const newFileName = `avion_${generateSlug(newAirplane.modelo)}.json`;
        const newFilePath = path.join(dataPath, newFileName);
        console.log(`Creando archivo: ${newFilePath}`);
        await fs.promises.writeFile(newFilePath, JSON.stringify(newAirplane, null, 2));
        res.statusCode = 201;
        return newAirplane;

      case 'PUT':
        // Actualizar un avión existente
        const updateData = await readBody(event);
        console.log("slug", slug);
        if (!slug) {
          res.statusCode = 400;
          return { error: 'Falta el slug para actualizar' };
        }

        const oldFilePath = path.join(dataPath, `avion_${slug}.json`);
        const newSlug = generateSlug(updateData.modelo); // Generar nuevo slug basado en el nuevo modelo
        const newFilePathForUpdate = path.join(dataPath, `avion_${newSlug}.json`);

        if (fs.existsSync(oldFilePath)) {
          // Renombrar el archivo si el slug cambia
          if (slug !== newSlug) {
            console.log(`Renombrando archivo de ${oldFilePath} a ${newFilePathForUpdate}`);
            await fs.promises.rename(oldFilePath, newFilePathForUpdate);
          }
          // Actualizar el contenido del archivo con los nuevos datos
          await fs.promises.writeFile(newFilePathForUpdate, JSON.stringify(updateData, null, 2));
          res.statusCode = 200;
          return updateData;
        } else {
          res.statusCode = 404;
          return { error: 'Avión no encontrado' };
        }

      case 'DELETE':
        // Eliminar un avión existente
        console.log("slug", slug);
        if (!slug) {
          res.statusCode = 400;
          return { error: 'Falta el slug para eliminar' };
        }
        const deleteFilePath = path.join(dataPath, `avion_${slug}.json`);
        if (fs.existsSync(deleteFilePath)) {
          console.log(`Eliminando archivo: ${deleteFilePath}`);
          await fs.promises.unlink(deleteFilePath);
          res.statusCode = 204;
          return;
        } else {
          res.statusCode = 404;
          return { error: 'Avión no encontrado' };
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.statusCode = 405;
        return `Método ${method} no permitido`;
    }
  } catch (error) {
    console.error('Error al manejar la solicitud:', error);
    res.statusCode = 500;
    return { error: 'Error interno del servidor' };
  }
});
