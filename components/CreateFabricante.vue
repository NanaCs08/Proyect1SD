<template>
  <div class="create-fabricante-form">
    <h2>{{ fabricante ? 'Editar' : 'Agregar' }} Fabricante</h2>
    <form @submit.prevent="submit">
      <input v-model="nombre" placeholder="Nombre del Fabricante" required class="form-input"/>
      <input v-model="pais_origen" placeholder="País de Origen" required class="form-input"/>
      <input v-model="año_fundacion" type="number" placeholder="Año de Fundación" required class="form-input"/>
      <textarea v-model="modelos_fabricados" placeholder="Modelos Fabricados (separados por comas)" required class="form-textarea"></textarea>
      <input v-model="imagen" placeholder="URL de la Imagen" required class="form-input"/>
      <div class="button-group">
        <button type="submit" class="submit-button">{{ fabricante ? 'Actualizar' : 'Crear' }} Fabricante</button>
        <button type="button" @click="$emit('close')" class="cancel-button">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['created', 'close']);

const props = defineProps({
  fabricante: Object,
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
    const editSlug = generateSlug(props.fabricante.nombre);
    await fetch(`/api/fabricantes?slug=${editSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFabricante),
    });
  } else {
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

const generateSlug = (text) => {
  if (!text || typeof text !== 'string') {
    return ''; 
  }
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};
</script>

<style scoped>
.create-fabricante-form {
  margin: 20px auto;
  padding: 30px;
  border-radius: 12px;
  background-color: #ffffff;
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
