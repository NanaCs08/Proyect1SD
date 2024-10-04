<template>
  <div class="airline-container">
    <Header />
    <div v-if="airline" class="airline-card">
      <h1>{{ airline.nombre }}</h1>
      <img :src="airline.imagen" :alt="`Imagen de ${airline.nombre}`" class="airline-img" />
      <div class="airline-details">
        <p><strong>País de Origen:</strong> {{ airline.pais_origen }}</p>
        <p><strong>Flota:</strong> {{ airline.flota }} aviones</p>
        <p><strong>Modelos Operados:</strong></p>
        <ul class="modelos-list">
          <li v-for="modelo in airline.modelos_operados" :key="modelo" class="modelo-item">{{ modelo }}</li>
        </ul>
      </div>
    </div>
    <div v-else class="loading">
      <p>Cargando...</p>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const airline = ref(null);
const route = useRoute();

const fetchAirlineData = async () => {
  const modules = import.meta.glob('@/data/aerolineas/*.json');
  const airlinePromises = Object.values(modules).map((module) => module());
  const airlineData = await Promise.all(airlinePromises);
  const allAirlines = airlineData.map(data => data.default || data);
  airline.value = allAirlines.find(a => generateSlug(a.nombre) === route.params.slug);
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
  fetchAirlineData();
});
</script>

<style scoped>
.airline-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background: linear-gradient(135deg, #f0f4f8, #e3e7ed);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Montserrat', sans-serif;
}

.airline-card {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
}

.airline-img {
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
}

.airline-details {
  margin-top: 20px;
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

.modelo-item {
  font-size: 1.1rem;
  color: #34495e;
  margin: 10px 0;
  transition: transform 0.3s ease, color 0.3s ease;
}

.modelo-item:hover {
  transform: translateX(5px);
  color: #2980b9;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .airline-card {
    padding: 20px;
  }

  h1 {
    font-size: 2rem;
  }

  .airline-img {
    max-width: 300px;
  }

  p {
    font-size: 1rem;
  }
}
</style>
