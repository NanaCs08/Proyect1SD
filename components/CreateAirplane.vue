<template>
  <div class="create-airplane-form">
    <h2>{{ airplane ? 'Editar' : 'Agregar' }} Avión</h2>
    <form @submit.prevent="submit">
      <input v-model="modelo" placeholder="Modelo" required />
      <input v-model="fabricante" placeholder="Fabricante" required />
      <input v-model="tipo" placeholder="Tipo (Comercial, Militar, etc.)" required />
      <input v-model="capacidad" type="number" placeholder="Capacidad" required />
      <input v-model="velocidad_maxima" placeholder="Velocidad Máxima (en km/h)" required />
      <input v-model="año_lanzamiento" type="number" placeholder="Año de Lanzamiento" required />
      <textarea v-model="aerolineas_usuarias" placeholder="Aerolíneas Usuarias (separadas por comas)" required></textarea>
      <input v-model="imagen" placeholder="URL de la Imagen" required />
      <button type="submit">{{ airplane ? 'Actualizar' : 'Crear' }} Avión</button>
      <button type="button" @click="$emit('close')">Cancelar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['created', 'close']);

const props = defineProps({
  airplane: Object, // Si se edita, el avión será pasado como prop
});

const modelo = ref(props.airplane ? props.airplane.modelo : '');
const fabricante = ref(props.airplane ? props.airplane.fabricante : '');
const tipo = ref(props.airplane ? props.airplane.tipo : '');
const capacidad = ref(props.airplane ? props.airplane.capacidad : 0);
const velocidad_maxima = ref(props.airplane ? props.airplane.velocidad_maxima : '');
const año_lanzamiento = ref(props.airplane ? props.airplane.año_lanzamiento : 0);
const aerolineas_usuarias = ref(props.airplane ? props.airplane.aerolineas_usuarias.join(', ') : '');
const imagen = ref(props.airplane ? props.airplane.imagen : '');

const submit = async () => {
  const newAirplane = {
    modelo: modelo.value,
    fabricante: fabricante.value,
    tipo: tipo.value,
    capacidad: capacidad.value,
    velocidad_maxima: velocidad_maxima.value,
    año_lanzamiento: año_lanzamiento.value,
    aerolineas_usuarias: aerolineas_usuarias.value.split(',').map(aerolinea => aerolinea.trim()),
    imagen: imagen.value,
  };

  if (props.airplane) {
    // Actualizar
    const editSlug = generateSlug(props.airplane.modelo);
    await fetch(`/api/aviones?slug=${editSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAirplane),
    });
  } else {
    // Crear nuevo avión
    await fetch('/api/aviones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAirplane),
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
.create-airplane-form {
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 400px;
}
</style>
