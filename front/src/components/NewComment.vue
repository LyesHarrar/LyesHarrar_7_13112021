<template>
    <form
        v-on:submit.prevent="publish"
        :postID="postID"
        class="new-comment">
        <textarea
            v-model="newComment.commentText"
            class="new-comment"
            placeholder="Votre commentaire bienveillant"
            rows="3"
            cols="10"
            required>
        </textarea>
        <button>Commenter cette publication</button>
    </form>
</template>

<script>
export default {
    name: "NewComment",
    props : {
        postID: {
            type: Number
        }
    },
    data: () => {
        return {
            newComment : {
                commentText: ""
            }
        }
    },
    methods: {
        publish() {
            let url = `http://localhost:3000/api/comment/${ this.postID }/`
            let options = {
                method: "POST",
                body: JSON.stringify(this.newComment),
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            }
            fetch(url, options)
                .then(res => res.json())
                .then(() => {
                    this.newComment.commentText = "";
                    this.$emit("comment-published");
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