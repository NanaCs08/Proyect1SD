<template>
  <div class="airplanes-container">
    <Header />
    <h1>Lista de Aviones</h1>
    <div class="airplanes-list">
      <div v-for="airplane in airplanes" :key="airplane.modelo" class="airplane-card">
        <!-- Asegúrate de que airplane.nombre no sea undefined antes de generar el slug -->
        <nuxt-link v-if="airplane.modelo" :to="{ path: `/aviones/${generateSlug(airplane.modelo)}` }" class="airplane-link">
          {{ airplane.modelo }}
        </nuxt-link>
        <div class="action-buttons">
          <button class="edit-button" @click="editAirplane(airplane)">Editar</button>
          <button class="delete-button" @click="deleteAirplane(generateSlug(airplane.modelo))">Eliminar</button>
        </div>
      </div>
    </div>
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
    
    const data = await response.text();
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
.airplanes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa, #e3e7ed);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Montserrat', sans-serif;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 40px;
}

.airplanes-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 0;
}

.airplane-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.airplane-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.airplane-link {
  display: block;
  font-size: 1.25rem;
  color: #3498db;
  text-decoration: none;
  margin-bottom: 15px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.airplane-link:hover {
  color: #2980b9;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-button {
  background-color: #f39c12;
  color: white;
}

.edit-button:hover {
  background-color: #e67e22;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
}

.delete-button:hover {
  background-color: #c0392b;
}

.add-airplane-button {
  display: block;
  margin: 40px auto;
  padding: 12px 30px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
}

.add-airplane-button:hover {
  background-color: #0056b3;
}
</style>
