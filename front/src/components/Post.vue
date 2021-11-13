<template>
    <div>
        <div class="post" :postID="postID">
            <div class="post-info">
                <div class="post-info-sender">
                    <img
                        class="post-info-sender-avatar"
                        :src="userInfo.avatarUrl"
                        alt="Avatar de l'utilisateur"
                    />
                    <h3
                        class="post-info-sender-name">
                        {{ userInfo.firstName }}
                        {{ userInfo.lastName }}
                    </h3>
                </div>
                <div class="post-info-time">
                    <h3>Posté le {{ convertDate }}</h3>
                    <img
                        v-if="postInfo.userID == visitorID || adminRights == 1"
                        @click="deletePost"
                        src="../assets/white-trash.png"
                        alt="Icône de suppression"
                    />
                </div>
            </div>

            <div class="post-content">
                <p
                    v-if="updateMessage.length >= 1"
                    class="alert-msg">
                    {{ updateMessage }}
                </p>
                <img
                    class="post-content-gif"
                    :src="postInfo.gifUrl"
                    alt="Gif publié par l'utilisateur"
                />
                <div class="post-content-text">
                    <div>
                        <h2>{{ postInfo.title }}</h2>
                        <p>{{ postInfo.text }}</p>
                    </div>
                    <div class="post-claps">
                        <img
                            v-if="postInfo.claps >= 1"
                            @click="clapPost"
                            src="../assets/clap.png"
                            alt="Icône accompagnant le nombre d'applaudissements"
                        />
                        <img
                            v-else
                            src="../assets/unclap.png"
                            @click="clapPost"
                            alt="Icône signifiant l'absence d'applaudissement"
                        />
                        <p v-if="postInfo.claps >= 1">{{ postInfo.claps }}</p>
                    </div>
                </div>
            </div>
            <button
                v-if="!invisibleComs"
                @click="invisibleComs = true"
                class="toggle-button"
                aria-hidden="true"
                >Masquer les commentaires
            </button>
            <button
                v-if="invisibleComs"
                @click="invisibleComs = false"
                class="toggle-button"
                aria-hidden="true"
                >Afficher les commentaires
            </button>
        </div>

        <div class="comment-section" v-show="!invisibleComs">
            <Comment
                v-for="comment in commentList"
                v-bind:key="comment.commentID"
                :commentID="comment.commentID"
                :postID="comment.postID"
                @comment-deleted="getCommentList"
            />
            <NewComment
                :postID="this.postID"
                @comment-published="getCommentList"
            />
        </div>
    </div>
</template>

<script>
import Comment from '../components/Comment'
import NewComment from '../components/NewComment'
export default {
    name: "Post",
    props: {
        postID: {
            type: Number
        }
    },
    components: {
        Comment,
        NewComment
    },
    data: () => {
        return {
            postInfo: {
                postID: "",
                userID: "",
                dateSend: "",
                title: "",
                gifUrl: "",
                text: "",
                claps: "",
            },
            userInfo : {
                avatarUrl : "",
                firstName: "",
                lastName: "",
            },
            updateMessage: "",
            visitorID: localStorage.getItem("userID"),
            commentList: [],
            invisibleComs: true,
            adminRights: localStorage.getItem("adminRights")
        }
    },
    computed: {
        convertDate() {
            let date = this.postInfo.dateSend.split(/[- T :]/);
            let convertDate = `${date[2]}/${date[1]}/${date[0]}`;
            return convertDate;
        },
    },
    methods: {
        getPostInfo() {
            let url = `http://localhost:3000/api/post/${ this.postID }`;
            let options = {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                }
            };
            fetch(url, options)
                .then(response => response.json())
                .then((data) => {
                    if (data[0]) {
                        this.postInfo.postID = data[0].postID;
                        this.postInfo.title = data[0].postTitle;
                        this.postInfo.gifUrl = data[0].gifUrl;
                        this.postInfo.text = data[0].postText;
                        this.postInfo.claps = data[0].claps;
                        this.postInfo.dateSend = data[0].dateSend;
                        this.postInfo.userID = data[0].userID;
                        this.getUserInfo();
                    }
                    else {
                        this.updateMessage = data.message;
                    }
                })
                .catch(error => console.log(error))
        },
        getUserInfo() {
            let url = `http://localhost:3000/api/user/${ this.postInfo.userID }`;
            let options = {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                }
            };
            fetch(url, options)
                .then(response => response.json())
                .then(data => {
                    this.userInfo.avatarUrl = data[0].avatarUrl;
                    this.userInfo.firstName = data[0].firstName;
                    this.userInfo.lastName = data[0].lastName;
                    this.userInfo.adminRights = data[0].adminRights;
                })
                .catch(error => console.log(error))
        },
        getCommentList() {
            let url = `http://localhost:3000/api/comment/${ this.postID }`;
            let options = {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                }
            };
            fetch(url, options)
                .then(response => response.json())
                .then((data) => {
                    this.commentList = data;
                })
            .catch(error => console.log(error))
        },
        deletePost() {
            let url = `http://localhost:3000/api/post/${ this.postID }`;
            let options = {
                method: "DELETE",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                }
            };
            fetch(url, options)
                .then(response => response.json())
                .then(() => {
                    this.$emit("post-deleted");
                })
                .catch(error => console.log(error))
        },
        clapPost() {
            let url = `http://localhost:3000/api/post/${ this.postID }`;
            let options = {
                method: "PUT",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                }
            };
            fetch(url, options)
                .then(response => response.json())
                .then(() => {
                    this.getPostInfo();
                })
                .catch(error => console.log(error))
        }
    },
    mounted() {
        this.getPostInfo();
        this.getCommentList();
    }
}
</script>

<style lang="css">
@import '../style/style.css'
</style>