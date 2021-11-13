<template>
	<div class="container">
		<HomeNav></HomeNav>
		<h1>Ajouter une publication</h1>
		<form v-on:submit.prevent="publish">
			<fieldset>
				<label for="post-title">Titre *
					<input
                        v-model="postInfo.title"
                        type="text"
                        id="post-title"
                        name="post-title"
                        placeholder="Titre de votre publication"
                        required
                    />
				</label>
			</fieldset>
			<fieldset>
				<label for="gif-url">URL du gif *
					<input
                        v-model="postInfo.gifUrl"
                        type="url"
                        id="gif-url"
                        placeholder="Lien vers le fichier GIPHY par exemple"
                        required
                    />
				</label>
			</fieldset>
			<fieldset>
				<label for="post-content">Texte *
					<textarea
                        v-model="postInfo.text"
                        id="post-content"
                        name="post-content"
                        required>
                    </textarea>
				</label>
			</fieldset>
			<p class="alert-msg" v-if="updateMessage.length >= 1">{{ updateMessage }}</p>
			<button type="submit" id="post-upload">Publier</button>
			<router-link v-if="published" to="/forum" tag="button">Se rendre sur le forum</router-link>
		</form>
	</div>
</template>

<script>
import HomeNav from '../components/HomeNav'
export default {
    name: 'NewPost',
    components: {
        HomeNav
    },
    data: () => {
        return {
            postInfo : {
                title: "",
                gifUrl: "",
                text: ""
            },
            updateMessage : "",
            published: false,
        }
    },
    methods: {
        publish() {
            let url = "http://localhost:3000/api/post"
            let options = {
                method: "POST",
                body: JSON.stringify(this.postInfo),
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            }
            fetch(url, options)
                .then(res => res.json())
                .then(res => {
                    if(res.ok) {
                        this.postInfo = {}
                    }
                    this.updateMessage = res.message;
                    this.published = true;
                })
            .catch(error => {
                this.errorMessage = error
            })
        }
    }
}
</script>

<style lang="css">
@import '../style/style.css'
</style>