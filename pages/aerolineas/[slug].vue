<template>
  <div>
    <Header />
    <div v-if="airline">
      <h1>{{ airline.nombre }}</h1>
      <img :src="airline.imagen" :alt="`Imagen de ${airline.nombre}`" />
      <p><strong>País de Origen:</strong> {{ airline.pais_origen }}</p>
      <p><strong>Flota:</strong> {{ airline.flota }}</p>
      <p><strong>Modelos Operados:</strong></p>
      <ul>
        <li v-for="modelo in airline.modelos_operados" :key="modelo">{{ modelo }}</li>
      </ul>
    </div>
    <div v-else>
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
h1 {
  text-align: center;
}

img {
  display: block;
  margin: 0 auto;
}

p {
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  text-align: center;
  margin: 0.5rem 0;
}
</style>
