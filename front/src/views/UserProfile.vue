<template>
    <div class="container">
        <HomeNav></HomeNav>
        <h1>Modifier votre profil</h1>
        <form>
            <fieldset>
                <img
                    class="avatar"
                    :src="userProfile.avatarUrl"
                />
                <label for="new-avatar-url">Changer de photo de profil
                    <input
                        v-on:change="updateAvatar"
                        id="new-avatar-url"
                        type="file"
                        accept="image/*"
                    />
                </label>
            </fieldset>
            <fieldset>
                <label for="new-first-name">Votre prénom n'est pas
                    <span class="bold-text">{{ userProfile.firstName }}</span> ?
                    <input
                        v-model="newProfile.firstName"
                        id="new-first-name"
                        placeholder="Votre vrai prénom"
                    />
                </label>
            </fieldset>
            <fieldset>
                <label for="new-last-name">Votre nom n'est pas
                    <span class="bold-text">{{ userProfile.lastName }}</span> ?
                    <input v-model="newProfile.lastName"
                        id="new-last-name"
                        placeholder="Votre vrai nom"
                    />
                </label>
            </fieldset>
            <p v-if="updateMessage.length >= 1" class="alert-msg">{{ updateMessage }}</p>
            <button @click="modifyProfile" id="modify-user">Modifier votre profil</button>
            <button @click="deleteProfile" id="delete-user">Supprimer votre compte</button>
        </form>
    </div>
</template>

<script>
import HomeNav from '../components/HomeNav'
export default {
    name: 'UserProfile',
    components: {
        HomeNav
    },
    data() {
        return {
            updateMessage: "",
            userProfile: {
                userID: localStorage.getItem("userID"),
                firstName: "",
                lastName: "",
                avatarUrl: ""
            },
            newProfile: {},
        }
    },
    methods: {
        setProfile() {
            let url = `http://localhost:3000/api/user/${ this.userProfile.userID }`;
            let options = {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                }
            };
            fetch(url, options)
                .then(response => response.json())
                .then(data => {
                    this.userProfile.firstName = data[0].firstName;
                    this.userProfile.lastName = data[0].lastName;
                    this.userProfile.avatarUrl = data[0].avatarUrl;
                })
                .catch(error => console.log(error))
        },
        updateAvatar(event) {
            const formData = new FormData();
            formData.append("image", event.target.files[0]);
            let url = `http://localhost:3000/api/user/${ this.userProfile.userID }`;
            let options = {
                method: "POST",
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem("token") },
                body: formData
            };
            fetch(url, options)
                .then(res => res.json())
                .then(data => {
                    this.userProfile.avatarUrl = data;
                })
                .then(() => {
                    this.updateMessage = "Votre photo de profil a bien été mise à jour";
                })
                .catch(error => console.log(error))
        },
        modifyProfile() {
            let url = `http://localhost:3000/api/user/${ this.userProfile.userID }`;
            let options = {
                method: "PUT",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.newProfile),
            };
            fetch(url, options)
                .then(res => res.json())
                .then(data => {
                    //récupérer le profil mis à jour
                    this.userProfile = data[0];
                    //réinitialiser les champs de formulaire
                    this.newProfile = {}
                })
                .catch(error => console.log(error))
        },
        deleteProfile() {
            let url = `http://localhost:3000/api/user/${ this.userProfile.userID }`;
            let options = {
                method: "DELETE",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                }
            };
            fetch(url, options)
                .then(res => res.json())
                .then(this.$router.push("/inscription"))
                .catch(error => console.log(error))
        },
    },
    mounted() {
        this.setProfile();
    }
}
</script>

<style lang="css">
  @import '../style/style.css'
</style>