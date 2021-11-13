<template>
    <header>
        <img
            src="../assets/logo-groupomania.png"
            id="logo-welcome"
            alt="Logo de Groupomania"
        />
        <nav class="welcome-nav">
            <router-link to="/" class="welcome-links">Se connecter</router-link>
            <router-link to="/inscription" class="welcome-links">S'inscrire</router-link>
        </nav>
    </header>
</template>

<script>
export default {
    name: "WelcomeNav",
};
</script>

<style lang="css" scoped>
@import '../style/style.css';
</style>