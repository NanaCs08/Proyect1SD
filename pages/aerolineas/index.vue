<template>
  <div>
    <Header />
    <div>
      <h1>Lista de Aerolíneas</h1>
      <ul>
        <li v-for="aerolinea in aerolineas" :key="aerolinea.nombre">
          <nuxt-link :to="`/aerolineas/${aerolinea.nombre}`">{{ aerolinea.nombre }}</nuxt-link>
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

const aerolineas = ref([]);

const importAerolíneas = async () => {
  const modules = import.meta.glob('@/data/aerolineas/*.json');
  const aerolineaPromises = Object.values(modules).map((module) => module());
  const aerolineaData = await Promise.all(aerolineaPromises);
  aerolineas.value = aerolineaData.flat();
};

onMounted(() => {
  importAerolíneas();
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
  margin: 0.5rem 0;
}
</style>