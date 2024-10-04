<template>
  <div class="create-airline-form">
    <h2>{{ airline ? 'Editar' : 'Agregar' }} Aerolínea</h2>
    <form @submit.prevent="submit">
      <input v-model="nombre" placeholder="Nombre" required class="form-input" />
      <input v-model="pais_origen" placeholder="País de Origen" required class="form-input" />
      <input v-model="flota" type="number" placeholder="Número de Flota" required class="form-input" />
      <textarea v-model="modelos_operados" placeholder="Modelos Operados (separados por comas)" required class="form-textarea"></textarea>
      <input v-model="imagen" placeholder="URL de la Imagen" required class="form-input" />
      <div class="button-group">
        <button type="submit" class="submit-button">{{ airline ? 'Actualizar' : 'Crear' }} Aerolínea</button>
        <button type="button" @click="$emit('close')" class="cancel-button">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  font-family: 'Montserrat', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.form-textarea {
  height: 100px;
}

.form-input:focus, .form-textarea:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.submit-button, .cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button {
  background-color: #007bff;
  color: white;
}

.submit-button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: #e74c3c;
  color: white;
}

.cancel-button:hover {
  background-color: #c0392b;
}
</style>
