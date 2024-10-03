<template>
  <div>
    <Header />
    <h1>Lista de Aviones</h1>
    <ul>
      <li v-for="airplane in airplanes" :key="airplane.modelo">
        <!-- Asegúrate de que airplane.nombre no sea undefined antes de generar el slug -->
        <nuxt-link v-if="airplane.modelo" :to="{ path: `/aviones/${generateSlug(airplane.modelo)}` }">
          {{ airplane.modelo }}
        </nuxt-link>
        <button @click="editAirplane(airplane)">Editar</button>
        <button @click="deleteAirplane(generateSlug(airplane.modelo))">Eliminar</button>
      </li>
    </ul>
    <button @click="showCreateForm = true" class="add-airplane-button">Agregar Avión</button>

    <!-- Formularios para crear o editar avión -->
    <CreateAirplane v-if="showCreateForm" @created="fetchAirplanes" @close="showCreateForm = false" />
    <CreateAirplane v-if="editForm" :airplane="selectedAirplane" @created="fetchAirplanes" @close="editForm = false" />
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import CreateAirplane from '@/components/CreateAirplane.vue';
import { ref, onMounted } from 'vue';

const airplanes = ref([]);
const showCreateForm = ref(false);
const editForm = ref(false);
const selectedAirplane = ref(null);

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

// Función para obtener los aviones del servidor
const fetchAirplanes = async () => {
  try {
    const response = await fetch('/api/aviones'); 
    
    if (!response.ok) throw new Error('Error al cargar aviones');
    
    // Leer la respuesta como texto para revisar su contenido antes de parsearlo
    const data = await response.text();
    // Intenta parsear el JSON solo si la respuesta no está vacía
    if (data) {
      airplanes.value = JSON.parse(data);
    } else {
      throw new Error('Respuesta vacía del servidor');
    }
  } catch (error) {
    console.error('Error al procesar los aviones:', error);
  }
};

// Función para editar avión
const editAirplane = (airplane) => {
  selectedAirplane.value = airplane;
  editForm.value = true;
};

// Función para eliminar avión
const deleteAirplane = async (slug) => {
  console.log("slug INDEX",slug);
  try {
    const response = await fetch(`/api/aviones?slug=${slug}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar avión');
    fetchAirplanes(); // Actualizar lista de aviones después de eliminar
  } catch (error) {
    console.error(error);
  }
};

// Cargar los aviones al montar el componente
onMounted(() => {
  fetchAirplanes();
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

.add-airplane-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-airplane-button:hover {
  background-color: #0056b3;
}
</style>
