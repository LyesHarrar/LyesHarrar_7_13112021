<template>
    <div class="container welcome-container">
        <WelcomeNav></WelcomeNav>
        <h1>Nouveau sur Groupomania ?</h1>
        <form v-on:submit.prevent="signup" class="welcome-form">
            <fieldset>
                <label for="firstname">Prénom *
                    <input
                        type="text"
                        id="firstname"
                        required
                        pattern="^\D*$"
                        placeholder="Renseignez ici votre prénom"
                        maxlength="30"
                        aria-label="Entrez votre prénom"
                        v-model="userInfo.firstName"
                    />
                </label>
            </fieldset>
            <fieldset>
                <label for="lastname">Nom *
                    <input
                        type="text"
                        id="lastname"
                        required
                        pattern="^\D*$"
                        placeholder="Renseignez ici votre nom de famille"
                        maxlength="30"
                        aria-label="Entrez votre nom"
                        v-model="userInfo.lastName"
                    />
                </label>
            </fieldset>
            <fieldset>
                <label for="email">Email *
                    <input
                        type="email"
                        id="email"
                        required
                        placeholder="Entrez une adresse email valide"
                        maxlength="60"
                        aria-label="Entrez votre adresse email"
                        v-model="userInfo.email"
                    />
                </label>
            </fieldset>
            <fieldset>
                <label for="password">Mot de passe *
                    <input
                        type="password"
                        id="password"
                        required
                        placeholder="Renseignez votre mot de passe"
                        aria-label="Choisissez un mot de passe comprenant 1 minuscule, 1 majuscule et 1 chiffre"
                        v-model="userInfo.password"
                    />
                </label>
            </fieldset>
            <fieldset>
                <label for="repeat-password">Confirmez votre mot de passe *
                    <input
                        type="password"
                        id="repeat-password"
                        required
                        placeholder="Tapez à nouveau le mot de passe choisi"
                        aria-label="Tapez à nouveau le mot de passe choisi"
                    />
                </label>
            </fieldset>
            <p v-if="errorMessage.length >= 1" class="alert-msg">{{ errorMessage }}</p>
            <button>Créez votre compte</button>
        </form>
    </div>
</template>

<script>
import WelcomeNav from '../components/WelcomeNav.vue'
export default {
    name: 'SignUp',
    components: { WelcomeNav },
    data: () => {
        return {
            userInfo: {
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            },
            errorMessage: ""
        }
    },
    methods: {
        signup() {
            if(this.userInfo.password == document.getElementById("repeat-password").value) {
                //construction de l'objet "profil" à envoyer à l'API
                let userProfile = {
                    "firstName": this.userInfo.firstName,
                    "lastName": this.userInfo.lastName,
                    "email": this.userInfo.email,
                    "password": this.userInfo.password
                }
                let url = "http://localhost:3000/api/user/signup"
                let options = {
                    method: "POST",
                    body: JSON.stringify(userProfile),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                fetch(url, options)
                    .then(res => res.json())
                    .then((res) => {
                        //vérifier la création de l'ID et du token et les stocker dans le localStorage
                        if(res.userID && res.token){
                            localStorage.setItem("userID", res.userID);
                            localStorage.setItem("token", res.token);
                            this.$router.push("forum");
                        }
                        else {
                            //sinon afficher le message d'erreur correspondant sous le formulaire
                            this.errorMessage = res.message
                        }
                    })
                .catch(error => {
                    this.errorMessage = error
                })
            }
            else {
                this.errorMessage = "Vous avez entré 2 mots de passe différents"
            }
        },
    },
    mounted() {
        localStorage.clear();
    }
}
</script>

<style lang="css">
@import "../style/style.css";
</style>
