<template>
  <div class="create-airplane-form">
    <h2>{{ airplane ? 'Editar' : 'Agregar' }} Avión</h2>
    <form @submit.prevent="submit">
      <input v-model="modelo" placeholder="Modelo" required class="form-input"/>
      <input v-model="fabricante" placeholder="Fabricante" required class="form-input"/>
      <input v-model="tipo" placeholder="Tipo (Comercial, Militar, etc.)" required class="form-input"/>
      <input v-model="capacidad" type="number" placeholder="Capacidad" required class="form-input"/>
      <input v-model="velocidad_maxima" placeholder="Velocidad Máxima (en km/h)" required class="form-input"/>
      <input v-model="año_lanzamiento" type="number" placeholder="Año de Lanzamiento" required class="form-input"/>
      <textarea v-model="aerolineas_usuarias" placeholder="Aerolíneas Usuarias (separadas por comas)" required class="form-textarea"></textarea>
      <input v-model="imagen" placeholder="URL de la Imagen" required class="form-input"/>
      <div class="button-group">
        <button type="submit" class="submit-button">{{ airplane ? 'Actualizar' : 'Crear' }} Avión</button>
        <button type="button" @click="$emit('close')" class="cancel-button">Cancelar</button>
      </div>
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
