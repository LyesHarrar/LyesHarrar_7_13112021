<template>
    <div class="comment" :commentID="commentID" :postID="postID">
        <p class="comment-info">Le {{ convertDate }}, {{ userInfo.firstName }} {{ userInfo.lastName }} a répondu :
            <img
                v-if="commentInfo.userID == visitorID || adminRights == 1"
                @click="deleteComment"
                src="../assets/trash.png"
                alt="Icône de suppression"
            />
        </p>
        <p class="comment-content">" {{ commentInfo.commentText }} "</p>
    </div>
</template>        

<script>
export default {
    name: "Comment",
    props: {
        commentID: {
            type: Number
        },
        postID: {
            type: Number
        }
    },
    data: () => {
        return {
            commentInfo: {
                userID: "",
                commentText: "",
                dateSend: ""
            },
            userInfo: {
                firstName: "",
                lastName: ""
            },
            visitorID: localStorage.getItem("userID"),
            adminRights: localStorage.getItem("adminRights")
        }
    },
    computed: {
        convertDate() {
            let date = this.commentInfo.dateSend.split(/[- T :]/);
            let convertDate = `${date[2]}/${date[1]}/${date[0]}`;
            return convertDate;
        }
    },
    methods: {
        getCommentInfo() {
            let url = `http://localhost:3000/api/comment/${ this.postID }/${ this.commentID}`;
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
                        this.commentInfo.userID = data[0].userID;
                        this.commentInfo.commentText = data[0].commentText;
                        this.commentInfo.dateSend = data[0].dateSend;
                        this.getUserInfo();
                    }
                    else {
                        this.updateMessage = data.message;
                    }
                })
                .catch(error => console.log(error))
        },
        getUserInfo() {
            let url = `http://localhost:3000/api/user/${ this.commentInfo.userID }`;
            let options = {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                }
            };
            fetch(url, options)
                .then(response => response.json())
                .then(data => {
                    this.userInfo.firstName = data[0].firstName;
                    this.userInfo.lastName = data[0].lastName;
                })
                .catch(error => console.log(error))
        },
        deleteComment() {
            let url = `http://localhost:3000/api/comment/${ this.postID }/${ this.commentID}`;
            let options = {
                method: "DELETE",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                }
            };
            fetch(url, options)
                .then(response => response.json())
                .then(() => {
                    this.$emit("comment-deleted");
                })
                .catch(error => console.log(error))
        },
    },
    mounted() {
        this.getCommentInfo();
    }
}
</script>

<style lang="css">
@import '../style/style.css';
</style>