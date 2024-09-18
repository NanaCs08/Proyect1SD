<template>
  <div>
    <Header />
    <div v-if="aerolinea">
      <h1>{{ aerolinea.nombre }}</h1>
      <img :src="aerolinea.imagen" :alt="`Imagen de ${aerolinea.nombre}`" />
      <p><strong>País de Origen:</strong> {{ aerolinea.pais_origen }}</p>
      <p><strong>Flota:</strong> {{ aerolinea.flota }}</p>
      <p><strong>Modelos Operados:</strong></p>
      <ul>
        <li v-for="modelo in aerolinea.modelos_operados" :key="modelo">
          <router-link :to="{ path: `/aviones/${generateSlug(modelo)}` }">{{ modelo }}</router-link>
        </li>
      </ul>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const aerolinea = ref(null);
const route = useRoute();

const fetchAerolineaData = async () => {
  const modules = import.meta.glob('@/data/aerolineas/*.json');
  const aerolineaPromises = Object.values(modules).map((module) => module());
  const aerolineaData = await Promise.all(aerolineaPromises);
  const allAerolineas = aerolineaData.map(data => data.default || data);
  aerolinea.value = allAerolineas.find(f => generateSlug(f.nombre) === route.params.slug);
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
  fetchAerolineaData();
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