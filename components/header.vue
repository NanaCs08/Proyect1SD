<template>
    <header>
        <nav>
            <ul>
                <li><nuxt-link to="/">Inicio</nuxt-link></li>
                <li><nuxt-link to="/aviones">Aviones</nuxt-link></li>
                <li><nuxt-link to="/fabricantes">Fabricantes</nuxt-link></li>
                <li><nuxt-link to="/aerolineas">Aerolíneas</nuxt-link></li>
            </ul>
        </nav>
    </header>
</template>

<style scoped>
header {
    background-color: #333;
    color: #fff;
    padding: 1rem;
}

nav ul {
    list-style: none;
    display: flex;
    gap: 15rem;
    justify-content: center;
}

nav a {
    color: #fff;
    text-decoration: none;
}
</style>