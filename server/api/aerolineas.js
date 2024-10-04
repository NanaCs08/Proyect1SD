import fs from 'fs';
import path from 'path';

// Ruta del directorio donde se encuentran los archivos JSON de las aerolíneas
const dataPath = path.resolve('data/aerolineas');

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
  

  try {
    switch (method) {
      case 'GET':
        if (slug) {
          // Buscar una aerolínea específica por el slug
          const filePath = path.join(dataPath, `aerolinea_${slug}.json`);
          console.log(`Buscando archivo: ${filePath}`);
          if (fs.existsSync(filePath)) {
            const airlineData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.statusCode = 200;
            return airlineData;  // Devuelve el JSON directamente en Nuxt 3
          } else {
            console.log('Aerolínea no encontrada');
            res.statusCode = 404;
            return { error: 'Aerolínea no encontrada' };
          }
        } else {
          // Leer todos los archivos JSON de aerolíneas
          const files = await fs.promises.readdir(dataPath);

          // Filtrar solo los archivos JSON
          const jsonFiles = files.filter(file => file.endsWith('.json'));

          // Verificar si hay archivos JSON
          if (jsonFiles.length === 0) {
            res.statusCode = 404;
            return { error: 'No hay aerolíneas disponibles' };
          }

          // Leer y parsear todos los archivos JSON de manera asíncrona
          const airlines = await Promise.all(
            jsonFiles.map(async (file) => {
              const filePath = path.join(dataPath, file);
              console.log(`Leyendo archivo: ${filePath}`);
              const fileData = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
              return fileData;
            })
          );
          
          res.statusCode = 200;
          return airlines;  // Devolver todas las aerolíneas
        }

      case 'POST':
        // Crear una nueva aerolínea
        const newAirline = await readBody(event);

        if (!newAirline.nombre || !newAirline.pais_origen || !newAirline.flota || !newAirline.modelos_operados || !newAirline.imagen) {
          console.log('Faltan campos requeridos');
          res.statusCode = 400;
          return { error: 'Faltan campos requeridos' };
        }
        const newFileName = `aerolinea_${generateSlug(newAirline.nombre)}.json`;
        const newFilePath = path.join(dataPath, newFileName);
        console.log(`Creando archivo: ${newFilePath}`);
        await fs.promises.writeFile(newFilePath, JSON.stringify(newAirline, null, 2));
        res.statusCode = 201;
        return newAirline;

      case 'PUT':
        // Actualizar una aerolínea existente
        const updateData = await readBody(event);
        console.log("slug", slug);
        if (!slug) {
          res.statusCode = 400;
          return { error: 'Falta el slug para actualizar' };
        }

        const oldFilePath = path.join(dataPath, `aerolinea_${slug}.json`);
        const newSlug = generateSlug(updateData.nombre); // Generar nuevo slug basado en el nuevo nombre
        const newFilePathForUpdate = path.join(dataPath, `aerolinea_${newSlug}.json`);

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
          return { error: 'Aerolínea no encontrada' };
        }

      case 'DELETE':
        // Eliminar una aerolínea existente
        if (!slug) {
          res.statusCode = 400;
          return { error: 'Falta el slug para eliminar' };
        }
        const deleteFilePath = path.join(dataPath, `aerolinea_${slug}.json`);
        console.log(deleteFilePath);
        if (fs.existsSync(deleteFilePath)) {
          console.log(`Eliminando archivo: ${deleteFilePath}`);
          await fs.promises.unlink(deleteFilePath);
          res.statusCode = 204;
          return;
        } else {
          res.statusCode = 404;
          return { error: 'Aerolínea no encontrada' };
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
