import fs from 'fs';
import path from 'path';

// Ruta del directorio donde se encuentran los archivos JSON de los fabricantes
const dataPath = path.resolve('data/fabricantes');

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
          // Buscar un fabricante específico por el slug
          const filePath = path.join(dataPath, `fabricante_${slug}.json`);
          console.log(`Buscando archivo: ${filePath}`);
          if (fs.existsSync(filePath)) {
            const fabricanteData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.statusCode = 200;
            return fabricanteData;  // Devuelve el JSON directamente en Nuxt 3
          } else {
            console.log('Fabricante no encontrado');
            res.statusCode = 404;
            return { error: 'Fabricante no encontrado' };
          }
        } else {
          // Leer todos los archivos JSON de fabricantes
          const files = await fs.promises.readdir(dataPath);

          // Filtrar solo los archivos JSON
          const jsonFiles = files.filter(file => file.endsWith('.json'));

          // Verificar si hay archivos JSON
          if (jsonFiles.length === 0) {
            res.statusCode = 404;
            return { error: 'No hay fabricantes disponibles' };
          }

          // Leer y parsear todos los archivos JSON de manera asíncrona
          const fabricantes = await Promise.all(
            jsonFiles.map(async (file) => {
              const filePath = path.join(dataPath, file);
              console.log(`Leyendo archivo: ${filePath}`);
              const fileData = JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
              return fileData;
            })
          );
          
          res.statusCode = 200;
          return fabricantes;  // Devolver todos los fabricantes
        }

      case 'POST':
        // Crear un nuevo fabricante
        const newFabricante = await readBody(event);

        if (!newFabricante.nombre || !newFabricante.pais_origen || !newFabricante.año_fundacion || !newFabricante.modelos_fabricados || !newFabricante.imagen) {
          console.log('Faltan campos requeridos');
          res.statusCode = 400;
          return { error: 'Faltan campos requeridos' };
        }
        const newFileName = `fabricante_${generateSlug(newFabricante.nombre)}.json`;
        const newFilePath = path.join(dataPath, newFileName);
        console.log(`Creando archivo: ${newFilePath}`);
        await fs.promises.writeFile(newFilePath, JSON.stringify(newFabricante, null, 2));
        res.statusCode = 201;
        return newFabricante;

      case 'PUT':
        // Actualizar un fabricante existente
        const updateData = await readBody(event);
        console.log("slug", slug);
        if (!slug) {
          res.statusCode = 400;
          return { error: 'Falta el slug para actualizar' };
        }
        const updateFilePath = path.join(dataPath, `fabricante_${slug}.json`);
        if (fs.existsSync(updateFilePath)) {
          console.log(`Actualizando archivo: ${updateFilePath}`);
          await fs.promises.writeFile(updateFilePath, JSON.stringify(updateData, null, 2));
          res.statusCode = 200;
          return updateData;
        } else {
          res.statusCode = 404;
          return { error: 'Fabricante no encontrado' };
        }

      case 'DELETE':
        // Eliminar un fabricante existente
        console.log("slug", slug);
        if (!slug) {
          res.statusCode = 400;
          return { error: 'Falta el slug para eliminar' };
        }
        const deleteFilePath = path.join(dataPath, `fabricante_${slug}.json`);
        if (fs.existsSync(deleteFilePath)) {
          console.log(`Eliminando archivo: ${deleteFilePath}`);
          await fs.promises.unlink(deleteFilePath);
          res.statusCode = 204;
          return;
        } else {
          res.statusCode = 404;
          return { error: 'Fabricante no encontrado' };
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
