<template>
  <div>
    <Header />
    <div v-if="avion">
      <h1>{{ avion.modelo }}</h1>
      <img :src="avion.imagen" :alt="`Imagen de ${avion.modelo}`" />
      <p>Fabricante: 
        <router-link :to="{ path: `/fabricantes/${generateSlug(avion.fabricante)}` }">
          {{ avion.fabricante }}
        </router-link>
      </p>
      <p>Tipo: {{ avion.tipo }}</p>
      <p>Capacidad: {{ avion.capacidad }}</p>
      <p>Velocidad Máxima: {{ avion.velocidad_maxima }}</p>
      <p>Año de Lanzamiento: {{ avion.año_lanzamiento }}</p>
      <p>Aerolíneas Usuarias: 
        <span v-for="(aerolinea, index) in avion.aerolineas_usuarias" :key="aerolinea">
          <router-link v-if="aerolineaExists(aerolinea)" :to="{ path: `/aerolineas/${generateSlug(aerolinea)}` }">
            {{ aerolinea }}
          </router-link>
          <span v-else>{{ aerolinea }}</span>
          <span v-if="index < avion.aerolineas_usuarias.length - 1">, </span>
        </span>
      </p>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const avion = ref(null);
const aerolineas = ref([]);
const route = useRoute();

const fetchAvionData = async () => {
  const modules = import.meta.glob('@/data/aviones/*.json');
  const avionPromises = Object.values(modules).map((module) => module());
  const avionData = await Promise.all(avionPromises);
  const allAviones = avionData.map(data => data.default || data);
  
  // Debugging: Log the loaded data and the route params
  console.log('Loaded aviones:', allAviones);
  console.log('Route params:', route.params.slug);
  
  avion.value = allAviones.find(a => generateSlug(a.modelo) === route.params.slug);
  
  // Debugging: Log the found avion
  console.log('Found avion:', avion.value);
};

const fetchAerolineasData = async () => {
  const modules = import.meta.glob('@/data/aerolineas/*.json');
  const aerolineaPromises = Object.values(modules).map((module) => module());
  const aerolineaData = await Promise.all(aerolineaPromises);
  aerolineas.value = aerolineaData.map(data => data.default || data);
};

const aerolineaExists = (nombre) => {
  return aerolineas.value.some(a => generateSlug(a.nombre) === generateSlug(nombre));
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
  fetchAvionData();
  fetchAerolineasData();
});
</script>

<style scoped>
h1 {
  text-align: center;
}

img {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}

p {
  text-align: center;
}
</style>