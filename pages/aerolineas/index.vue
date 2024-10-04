<template>
  <div class="airlines-container">
    <Header />
    <h1>Lista de Aerolíneas</h1>
    <div class="airlines-list">
      <div v-for="airline in airlines" :key="airline.nombre" class="airline-card">
        <nuxt-link v-if="airline.nombre" :to="{ path: `/aerolineas/${generateSlug(airline.nombre)}` }" class="airline-link">
          {{ airline.nombre }}
        </nuxt-link>
        <div class="action-buttons">
          <button class="edit-button" @click="editAirline(airline)">Editar</button>
          <button class="delete-button" @click="deleteAirline(generateSlug(airline.nombre))">Eliminar</button>
        </div>
      </div>
    </div>
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
.airlines-container {
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

.airlines-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 0;
}

.airline-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.airline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.airline-link {
  display: block;
  font-size: 1.25rem;
  color: #3498db;
  text-decoration: none;
  margin-bottom: 15px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.airline-link:hover {
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

.add-airline-button {
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

.add-airline-button:hover {
  background-color: #0056b3;
}
</style>
