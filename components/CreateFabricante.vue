<template>
  <div class="create-fabricante-form">
    <h2>{{ fabricante ? 'Editar' : 'Agregar' }} Fabricante</h2>
    <form @submit.prevent="submit">
      <input v-model="nombre" placeholder="Nombre del Fabricante" required />
      <input v-model="pais_origen" placeholder="País de Origen" required />
      <input v-model="año_fundacion" type="number" placeholder="Año de Fundación" required />
      <textarea v-model="modelos_fabricados" placeholder="Modelos Fabricados (separados por comas)" required></textarea>
      <input v-model="imagen" placeholder="URL de la Imagen" required />
      <button type="submit">{{ fabricante ? 'Actualizar' : 'Crear' }} Fabricante</button>
      <button type="button" @click="$emit('close')">Cancelar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['created', 'close']);

const props = defineProps({
  fabricante: Object, // Si se edita, el fabricante será pasado como prop
});

const nombre = ref(props.fabricante ? props.fabricante.nombre : '');
const pais_origen = ref(props.fabricante ? props.fabricante.pais_origen : '');
const año_fundacion = ref(props.fabricante ? props.fabricante.año_fundacion : 0);
const modelos_fabricados = ref(props.fabricante ? props.fabricante.modelos_fabricados.join(', ') : '');
const imagen = ref(props.fabricante ? props.fabricante.imagen : '');

const submit = async () => {
  const newFabricante = {
    nombre: nombre.value,
    pais_origen: pais_origen.value,
    año_fundacion: año_fundacion.value,
    modelos_fabricados: modelos_fabricados.value.split(',').map(modelo => modelo.trim()),
    imagen: imagen.value,
  };

  if (props.fabricante) {
    // Actualizar
    const editSlug = generateSlug(props.fabricante.nombre);
    await fetch(`/api/fabricantes?slug=${editSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFabricante),
    });
  } else {
    // Crear nuevo fabricante
    await fetch('/api/fabricantes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFabricante),
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
.create-fabricante-form {
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  max-width: 400px;
}
</style>
