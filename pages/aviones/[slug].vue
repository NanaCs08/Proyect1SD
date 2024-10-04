<template>
  <div class="avion-container">
    <Header />
    <div v-if="avion" class="avion-card">
      <h1>{{ avion.modelo }}</h1>
      <img :src="avion.imagen" :alt="`Imagen de ${avion.modelo}`" class="avion-img" />
      <div class="avion-details">
        <p><strong>Fabricante:</strong> 
          <router-link :to="{ path: `/fabricantes/${generateSlug(avion.fabricante)}` }" class="detail-link">
            {{ avion.fabricante }}
          </router-link>
        </p>
        <p><strong>Tipo:</strong> {{ avion.tipo }}</p>
        <p><strong>Capacidad:</strong> {{ avion.capacidad }} pasajeros</p>
        <p><strong>Velocidad Máxima:</strong> {{ avion.velocidad_maxima }} km/h</p>
        <p><strong>Año de Lanzamiento:</strong> {{ avion.año_lanzamiento }}</p>
        <p><strong>Aerolíneas Usuarias:</strong> 
          <span v-for="(aerolinea, index) in avion.aerolineas_usuarias" :key="aerolinea">
            <router-link v-if="aerolineaExists(aerolinea)" :to="{ path: `/aerolineas/${generateSlug(aerolinea)}` }" class="detail-link">
              {{ aerolinea }}
            </router-link>
            <span v-else>{{ aerolinea }}</span>
            <span v-if="index < avion.aerolineas_usuarias.length - 1">, </span>
          </span>
        </p>
      </div>
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
  avion.value = allAviones.find(a => generateSlug(a.modelo) === route.params.slug);
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
.avion-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa, #e3e7ed);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Montserrat', sans-serif;
}

.avion-card {
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

.avion-img {
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
}

.avion-details {
  margin-top: 20px;
}

p {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 10px 0;
}

.detail-link {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.detail-link:hover {
  color: #2980b9;
}

@media (max-width: 768px) {
  .avion-card {
    padding: 20px;
  }

  h1 {
    font-size: 2rem;
  }

  .avion-img {
    max-width: 300px;
  }

  p {
    font-size: 1rem;
  }
}
</style>
