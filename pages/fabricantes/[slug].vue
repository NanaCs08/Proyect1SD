<template>
  <div class="page-container">
    <Header class="full-width" />
    <div class="content-container">
      <div v-if="fabricante" class="fabricante-card">
        <h1>{{ fabricante.nombre }}</h1>
        <img :src="fabricante.imagen" :alt="`Imagen de ${fabricante.nombre}`" class="fabricante-img" />
        <p><strong>País de Origen:</strong> {{ fabricante.pais_origen }}</p>
        <p><strong>Año de Fundación:</strong> {{ fabricante.año_fundacion }}</p>
        <p><strong>Modelos Fabricados:</strong></p>
        <ul class="modelos-list">
          <li v-for="modelo in fabricante.modelos_fabricados" :key="modelo">
            <router-link class="modelo-link" :to="{ path: `/aviones/${generateSlug(modelo)}` }">
              {{ modelo }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <Footer class="full-width" />
  </div>
</template>

<script setup>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const fabricante = ref(null);
const route = useRoute();

const fetchFabricanteData = async () => {
  const modules = import.meta.glob('@/data/fabricantes/*.json');
  const fabricantePromises = Object.values(modules).map((module) => module());
  const fabricanteData = await Promise.all(fabricantePromises);
  const allFabricantes = fabricanteData.map(data => data.default || data);
  fabricante.value = allFabricantes.find(f => generateSlug(f.nombre) === route.params.slug);
};

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Reemplaza espacios con -
    .replace(/[^\w\-]+/g, '')       // Elimina caracteres no válidos
    .replace(/\-\-+/g, '-')         // Reemplaza múltiples - con uno solo
    .replace(/^-+/, '')             // Elimina - al inicio
    .replace(/-+$/, '');            // Elimina - al final
};

onMounted(() => {
  fetchFabricanteData();
});
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.full-width {
  width: 100vw; /* Asegura que el Header y Footer ocupen todo el ancho */
}

.content-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.fabricante-card {
  max-width: 900px; /* Mantiene el contenido principal centrado y en un ancho más razonable */
  background-color: #ffffff;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
}

.fabricante-img {
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
}

p {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 10px 0;
}

.modelos-list {
  list-style-type: none;
  padding: 0;
}

.modelos-list li {
  margin: 10px 0;
}

.modelo-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  font-size: 1rem;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.modelo-link:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .fabricante-card {
    padding: 20px;
  }

  h1 {
    font-size: 2rem;
  }

  .fabricante-img {
    max-width: 300px;
  }

  p {
    font-size: 1rem;
  }

  .modelo-link {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}
</style>
