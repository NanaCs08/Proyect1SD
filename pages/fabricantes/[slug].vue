<template>
    <div v-if="fabricante">
      <h1>{{ fabricante.nombre }}</h1>
      <p><strong>País de Origen:</strong> {{ fabricante.pais_origen }}</p>
      <p><strong>Año de Fundación:</strong> {{ fabricante.año_fundacion }}</p>
      <p><strong>Modelos Fabricados:</strong></p>
      <ul>
        <li v-for="modelo in fabricante.modelos_fabricados" :key="modelo">{{ modelo }}</li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const fabricante = ref(null)
  
  onMounted(async () => {
    const { nombre } = route.params
    const response = await axios.get('/data/fabricantes.json')
    fabricante.value = response.data.find(f => f.nombre === nombre)
  })
  </script>
  