<template>
  <div>
    <Header />
    <div>
      <h1>Lista de Fabricantes</h1>
      <ul>
        <li v-for="fabricante in fabricantes" :key="fabricante.nombre">
          <nuxt-link :to="`/fabricantes/${fabricante.nombre}`">{{ fabricante.nombre }}</nuxt-link>
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

const fabricantes = ref([]);

const importFabricantes = async () => {
  const modules = import.meta.glob('@/data/fabricantes/*.json');
  const fabricantePromises = Object.values(modules).map((module) => module());
  const fabricanteData = await Promise.all(fabricantePromises);
  fabricantes.value = fabricanteData.flat();
};

onMounted(() => {
  importFabricantes();
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