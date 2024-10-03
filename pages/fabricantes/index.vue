<template>
  <div>
    <Header />
    <h1>Lista de Fabricantes</h1>
    <ul>
      <li v-for="fabricante in fabricantes" :key="fabricante.nombre">
        <!-- Asegúrate de que fabricante.nombre no sea undefined antes de generar el slug -->
        <nuxt-link v-if="fabricante.nombre" :to="{ path: `/fabricantes/${generateSlug(fabricante.nombre)}` }">
          {{ fabricante.nombre }}
        </nuxt-link>
        <button @click="editFabricante(fabricante)">Editar</button>
        <button @click="deleteFabricante(generateSlug(fabricante.nombre))">Eliminar</button>
      </li>
    </ul>
    <button @click="showCreateForm = true" class="add-fabricante-button">Agregar Fabricante</button>

    <!-- Formularios para crear o editar fabricante -->
    <CreateFabricante v-if="showCreateForm" @created="fetchFabricantes" @close="showCreateForm = false" />
    <CreateFabricante v-if="editForm" :fabricante="selectedFabricante" @created="fetchFabricantes" @close="editForm = false" />
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import CreateFabricante from '@/components/CreateFabricante.vue';
import { ref, onMounted } from 'vue';

const fabricantes = ref([]);
const showCreateForm = ref(false);
const editForm = ref(false);
const selectedFabricante = ref(null);

// Función para generar slug de forma segura
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

// Función para obtener los fabricantes del servidor
const fetchFabricantes = async () => {
  try {
    const response = await fetch('/api/fabricantes'); 
    
    if (!response.ok) throw new Error('Error al cargar fabricantes');
    
    // Leer la respuesta como texto para revisar su contenido antes de parsearlo
    const data = await response.text();
    // Intenta parsear el JSON solo si la respuesta no está vacía
    if (data) {
      fabricantes.value = JSON.parse(data);
    } else {
      throw new Error('Respuesta vacía del servidor');
    }
  } catch (error) {
    console.error('Error al procesar los fabricantes:', error);
  }
};

// Función para editar fabricante
const editFabricante = (fabricante) => {
  selectedFabricante.value = fabricante;
  editForm.value = true;
};

// Función para eliminar fabricante
const deleteFabricante = async (slug) => {
  console.log("slug INDEX",slug);
  try {
    const response = await fetch(`/api/fabricantes?slug=${slug}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar fabricante');
    fetchFabricantes(); // Actualizar lista de fabricantes después de eliminar
  } catch (error) {
    console.error(error);
  }
};

// Cargar los fabricantes al montar el componente
onMounted(() => {
  fetchFabricantes();
});
</script>

<style scoped>
h1 {
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  text-align: center;
  margin: 1rem 0;
}

button {
  margin-left: 10px;
}

.add-fabricante-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-fabricante-button:hover {
  background-color: #0056b3;
}
</style>
