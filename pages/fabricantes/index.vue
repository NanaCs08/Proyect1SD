<template>
  <div class="fabricantes-container">
    <Header />
    <h1>Lista de Fabricantes</h1>
    <div class="fabricantes-list">
      <div v-for="fabricante in fabricantes" :key="fabricante.nombre" class="fabricante-card">
        <nuxt-link v-if="fabricante.nombre" :to="{ path: `/fabricantes/${generateSlug(fabricante.nombre)}` }" class="fabricante-link">
          {{ fabricante.nombre }}
        </nuxt-link>
        <div class="action-buttons">
          <button class="edit-button" @click="editFabricante(fabricante)">Editar</button>
          <button class="delete-button" @click="deleteFabricante(generateSlug(fabricante.nombre))">Eliminar</button>
        </div>
      </div>
    </div>
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

const generateSlug = (text) => {
  if (!text || typeof text !== 'string') {
    return ''; 
  }
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
};

const fetchFabricantes = async () => {
  try {
    const response = await fetch('/api/fabricantes'); 
    
    if (!response.ok) throw new Error('Error al cargar fabricantes');
    
    const data = await response.text();
    
    if (data) {
      fabricantes.value = JSON.parse(data);
    } else {
      throw new Error('Respuesta vacía del servidor');
    }
  } catch (error) {
    console.error('Error al procesar los fabricantes:', error);
  }
};

const editFabricante = (fabricante) => {
  selectedFabricante.value = fabricante;
  editForm.value = true;
};

const deleteFabricante = async (slug) => {
  console.log("slug INDEX",slug);
  try {
    const response = await fetch(`/api/fabricantes?slug=${slug}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar fabricante');
    fetchFabricantes(); 
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchFabricantes();
});
</script>

<style scoped>
.fabricantes-container {
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

.fabricantes-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 0;
}

.fabricante-card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.fabricante-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.fabricante-link {
  display: block;
  font-size: 1.25rem;
  color: #3498db;
  text-decoration: none;
  margin-bottom: 15px;
  font-weight: bold;
  transition: color 0.3s ease;
}

.fabricante-link:hover {
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

.add-fabricante-button {
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

.add-fabricante-button:hover {
  background-color: #0056b3;
}
</style>
