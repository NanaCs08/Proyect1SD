<template>
  <div class="catalogue-container">
    <Header />
    <div class="intro">
      <h1>Bienvenido a nuestro Catálogo de Aviones</h1>
      <p>Explora nuestras secciones para conocer más sobre aviones, fabricantes y aerolíneas.</p>
    </div>
    <hr class="divider">
    <div class="main-section">
      <main>
        <ul class="airplane-list">
          <li v-for="avion in aviones" :key="avion.modelo" class="airplane-item">
            <nuxt-link class="airplane-link" :to="{ path: `/aviones/${generateSlug(avion.modelo)}` }">
              {{ avion.modelo }}
            </nuxt-link>
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
.catalogue-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background: linear-gradient(135deg, #f0f4f8, #e0e8f0);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Montserrat', sans-serif;
}

.intro {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

p {
  font-size: 1.25rem;
  color: #7f8c8d;
}

.divider {
  margin: 30px 0;
  border: none;
  border-top: 2px solid #bdc3c7;
}

.main-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.airplane-list {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
}

.airplane-item {
  text-align: center;
}

.airplane-link {
  display: inline-block;
  padding: 15px 30px;
  background-color: #3498db;
  color: white;
  font-size: 1.1rem;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.airplane-link:hover {
  background-color: #2980b9;
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .catalogue-container {
    padding: 20px;
  }

  h1 {
    font-size: 2.5rem;
  }

  p {
    font-size: 1.1rem;
  }

  .airplane-link {
    font-size: 1rem;
  }
}
</style>
