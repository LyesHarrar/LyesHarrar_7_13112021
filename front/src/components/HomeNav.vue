<template>
    <header>
        <nav>
            <router-link
                to="/forum"
                aria-label="accéder à la page d'accueil"
                aria-labelledby="lien">
                <img 
                    src="../assets/logo-groupomania.png"
                    id="logo"
                    alt="Groupomania logo"
                />
            </router-link>
            <div class="nav-links">
                <router-link
                    to="/publier"
                    aria-label="accéder à la page de création d'une publication"
                    aria-labelledby="lien">
                    <img class="nav-icon" src="../assets/send.png">
                </router-link> 
                <router-link
                    to="/profil"
                    aria-label="accéder à la page de modification du profil utilisateur"
                    aria-labelledby="lien">
                    <img class="nav-icon" src="../assets/user.png">
                </router-link>
                <img @click="logout" class="nav-icon" src="../assets/logout.png">
            </div>
        </nav>
    </header>
</template>

<script>
export default {
    name: "HomeNav",
    methods: {
        logout() {
            localStorage.clear();
            this.$router.push("/");
        }
    }
}
</script>

<style lang="css">
@import '../style/style.css'
</style>