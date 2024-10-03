<template>
  <div>
    <Header />
    <h1>Lista de Aerolíneas</h1>
    <ul>
      <li v-for="airline in airlines" :key="airline.nombre">
        <!-- Asegúrate de que airline.nombre no sea undefined antes de generar el slug -->
        <nuxt-link v-if="airline.nombre" :to="{ path: `/aerolineas/${generateSlug(airline.nombre)}` }">
          {{ airline.nombre }}
        </nuxt-link>
        <button @click="editAirline(airline)">Editar</button>
        <button @click="deleteAirline(generateSlug(airline.nombre))">Eliminar</button>
      </li>
    </ul>
    <button @click="showCreateForm = true" class="add-airline-button">Agregar Aerolínea</button>

    <!-- Formularios para crear o editar aerolínea -->
    <CreateAirline v-if="showCreateForm" @created="fetchAirlines" @close="showCreateForm = false" />
    <CreateAirline v-if="editForm" :airline="selectedAirline" @created="fetchAirlines" @close="editForm = false" />
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import CreateAirline from '@/components/CreateAirline.vue';
import { ref, onMounted } from 'vue';

const airlines = ref([]);
const showCreateForm = ref(false);
const editForm = ref(false);
const selectedAirline = ref(null);

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

// Función para obtener las aerolíneas del servidor
const fetchAirlines = async () => {
  try {
    const response = await fetch('/api/aerolineas'); 
    
    if (!response.ok) throw new Error('Error al cargar aerolíneas');
    
    // Leer la respuesta como texto para revisar su contenido antes de parsearlo
    const data = await response.text();
    // Intenta parsear el JSON solo si la respuesta no está vacía
    if (data) {
      airlines.value = JSON.parse(data);
    } else {
      throw new Error('Respuesta vacía del servidor');
    }
  } catch (error) {
    console.error('Error al procesar las aerolíneas:', error);
  }
};



// Función para editar aerolínea
const editAirline = (airline) => {
  selectedAirline.value = airline;
  editForm.value = true;
};

// Función para eliminar aerolínea
const deleteAirline = async (slug) => {
  console.log("slug INDEX",slug);
  try {
    const response = await fetch(`/api/aerolineas?slug=${slug}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar aerolínea');
    fetchAirlines(); // Actualizar lista de aerolíneas después de eliminar
  } catch (error) {
    console.error(error);
  }
};

// Cargar las aerolíneas al montar el componente
onMounted(() => {
  fetchAirlines();
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

.add-airline-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-airline-button:hover {
  background-color: #0056b3;
}
</style>
