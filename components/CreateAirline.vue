<template>
  <div class="create-airline-form">
    <h2>{{ airline ? 'Editar' : 'Agregar' }} Aerolínea</h2>
    <form @submit.prevent="submit">
      <input v-model="nombre" placeholder="Nombre" required />
      <input v-model="pais_origen" placeholder="País de Origen" required />
      <input v-model="flota" type="number" placeholder="Número de Flota" required />
      <textarea v-model="modelos_operados" placeholder="Modelos Operados (separados por comas)" required></textarea>
      <input v-model="imagen" placeholder="URL de la Imagen" required />
      <button type="submit">{{ airline ? 'Actualizar' : 'Crear' }} Aerolínea</button>
      <button type="button" @click="$emit('close')">Cancelar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const emit = defineEmits(['created', 'close']);

const props = defineProps({
  airline: Object, // Si se edita, la aerolínea será pasada como prop
});

const nombre = ref(props.airline ? props.airline.nombre : '');
const pais_origen = ref(props.airline ? props.airline.pais_origen : '');
const flota = ref(props.airline ? props.airline.flota : 0);
const modelos_operados = ref(props.airline ? props.airline.modelos_operados.join(', ') : '');
const imagen = ref(props.airline ? props.airline.imagen : '');

const submit = async () => {
  const newAirline = {
    nombre: nombre.value,
    pais_origen: pais_origen.value,
    flota: flota.value,
    modelos_operados: modelos_operados.value.split(',').map(modelo => modelo.trim()),
    imagen: imagen.value,
  };

  if (props.airline) {
    // Actualizar
    const editSlug = generateSlug(props.airline.nombre);
    await fetch(`/api/aerolineas?slug=${editSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAirline),
    });
  } else {
    // Crear nueva aerolínea
    await fetch('/api/aerolineas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAirline),
    });
  }

  emit('created');
};

// Función para generar slug de forma segura
const generateSlug = (text) => {
  if (!text || typeof text !== 'string') {
    return ''; // Devuelve un slug vacío si el texto no es válido
  }
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')           // Reemplazar espacios con guiones
    .replace(/[^\w\-]+/g, '')       // Eliminar caracteres no válidos
    .replace(/\-\-+/g, '-')         // Reemplazar múltiples guiones por uno solo
    .replace(/^-+/, '')             // Eliminar guiones al inicio
    .replace(/-+$/, '');            // Eliminar guiones al final
};
</script>

<style scoped>
.create-airline-form {
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 400px;
}
</style>
