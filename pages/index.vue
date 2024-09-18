<template>
  <div>
    <Header />
    <div>
      <h1>Bienvenido a nuestro Catálogo de Aviones</h1>
      <p>Explora nuestras secciones para conocer más sobre aviones, fabricantes y aerolíneas.</p>
    </div>
    <div>
      <main>
        <nuxt-page />
        <ul>
          <li v-for="avion in aviones" :key="avion.modelo">
            <nuxt-link :to="{ path: `/aviones/${generateSlug(avion.modelo)}` }">{{ avion.modelo }}</nuxt-link>
          </li>
        </ul>
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import { ref, onMounted } from 'vue';

const aviones = ref([]);

const importAviones = async () => {
  const modules = import.meta.glob('@/data/aviones/*.json');
  const avionPromises = Object.values(modules).map((module) => module());
  const avionData = await Promise.all(avionPromises);
  aviones.value = avionData.map(data => data.default || data);
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
  importAviones();
});
</script>

<style scoped>
h1 {
  text-align: center;
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