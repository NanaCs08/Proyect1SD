<template>
  <div>
    <Header />
    <div v-if="fabricante">
      <h1>{{ fabricante.nombre }}</h1>
      <img :src="fabricante.imagen" :alt="`Imagen de ${fabricante.nombre}`" />
      <p><strong>País de Origen:</strong> {{ fabricante.pais_origen }}</p>
      <p><strong>Año de Fundación:</strong> {{ fabricante.año_fundacion }}</p>
      <p><strong>Modelos Fabricados:</strong></p>
      <ul>
        <li v-for="modelo in fabricante.modelos_fabricados" :key="modelo">
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