
<template>
<main class="container">
  <!-- bloc ajouter un post --> 
  <section class="createCard">
    <div>          
      <form @submit.prevent="sendPost()" >
        <div>
          <textarea class="box__message" v-model="inputContent" type="text" placeholder="Commencer un post..." />
        </div>
        <div class="label__post">
          <label class="label__file" for="files">Photo <i class="far fa-images"></i></label>
          <button type="submit" class="post__btn">Publier</button>
        </div>
        
        <div>
          <input id="files" class="uploading-image hidden" ref="uploadImg" @change="uploadImage();previewImage" type="file" name="image" accept=".jpg, .jpeg, .gif, .png">
          <img :src="newImage" id="previewImg" @click="form-reset">
        </div>
        
      </form>              
    </div> 
  </section>
  <!-- bloc avec tous le(s) post(s) -->    
  <section id="main-feed" >
    <div>
      <h1 v-if ="posts.length !=0">Dernières Publications</h1>   
      <h1 v-else> Aucune publication pour le moment, soyez le premier à en créer une ! </h1>
    </div>
    <article>
        <div class="post" v-for="post in posts.slice().reverse()" :key="post.id"  >
            <div class="post__header">
              <div class="post__date">
                <div class="profile__img">
                  <img v-if="post.User.imageUrl" :src="post.User.imageUrl" @click="openProfile(post.UserId)"  alt="image user" />
                </div>
                <div >
                    <div class="post__user" @click="openProfile(post.UserId)">{{ post.User.username }}</div>
                    <div class="post__hour"> le {{ post.createdAt.slice(0,10) + ' à ' + post.createdAt.slice(11,16)}}</div>
                </div>
              </div>
              <div class="icons__post">
              <!-- <label v-show="isAdmin || post.UserId == userId" class="label__post" @click="modifypost(post.id)"><i class="fa fa-fw fa-edit"></i></label> -->
                <label v-show="isAdmin || post.UserId == userId" class="label__post" @click="deletepost(post.id)"><i class="fa fa-fw fa-trash"></i></label>                                                                                     
              </div>                                                                                          
            </div>
            <p class="post__content" @click="openPost(post.id)"> {{ post.content }} </p>
            <div class="post__img" @click="openPost(post.id)" >
                <img :src="post.imageUrl" v-if="post.imageUrl!==null"  alt="image postée" />
            </div>
             
            <div class="post__subsection">
                <div class="post__comments" @click="isHidden= true">Commenter<i class="far fa-comment-alt"></i></div>
                <div class="post__React">React <i class="far fa-laugh-beam"></i><i class="far fa-thumbs-down"></i><i class="far fa-thumbs-up"></i></div>
            </div>
            <!-- section des commentaires -->
            <transition name="slide-fade">
            <div class="comment_wrap" v-if="isHidden">
                  <div  class="comment" v-for="Comment in post.Comments.slice().reverse()" :key="Comment.id">
                    <div class="comment__date">
                          <span class="comment__user">{{ Comment.User.username }}</span>
                          <span class="comment__hour">{{ Comment.createdAt.slice(0,10) + ' à ' + Comment.createdAt.slice(11,16)}}
                          <label v-show="isAdmin || Comment.UserId == userId" class="delete__comment" @click="deleteComment(Comment.id,post.id)">
                            <i class="fa fa-fw fa-trash"></i>
                            </label>
                          </span>                                                                            
                    </div>
                    <p class="comment__content"> {{ Comment.content }} </p>
                  </div>
                  <form @submit.prevent="commentPage(post.id)" class="form__comment">
                    <div>
                      <textarea class="box__comment" v-model="commentContent" type="text" placeholder="Exprimer vous..." />
                    </div>
                    <button type="submit" class="sendCom__btn">Envoyer</button>
                  </form>
                    
            </div>
            </transition>                            
        </div>                        
    </article>
  </section>
</main>
</template>

<script>
import axios from "axios";
import router from "../router";
export default {
    name: "Feed",
    data() {
        return {
            posts:[],            
            inputContent: "",
            commentContent:"",
            file:"",
            newImage: "",
            isHidden: false,
            userId:JSON.parse(localStorage.getItem("userId")),
            isAdmin:JSON.parse(localStorage.getItem("isAdmin")),
        }
    },
    computed: {
      
    },
    created: function() {
        axios.get("https://social-network-gn.herokuapp.com/api/post/", { headers: {"Authorization": "Bearer " + localStorage.getItem("token")} })
        .then(res => {  
          if (res){
            this.posts = res.data;
            console.log(this.posts);
          } else {
            console.log("aucun post")
          }
        }); 
    },
    methods: {
          lsGetItem(key) {
    return JSON.parse(localStorage.getItem(key));
    },  
    openPost(postId){
      localStorage.setItem("postId", postId);
      router.push({ path: '/post' }) 
    },
    openProfile(profileId){
      localStorage.setItem("profileId", profileId);
      router.push({ path: '/userprofile' }) 
    },
    formReset(){
      this.$refs.uploadImg.value = "";
    },
    uploadImage(){
      this.file = this.$refs.uploadImg.files[0];
      this.newImage = URL.createObjectURL(this.file)
    },
    sendPost() {
      if (this.inputContent==""){
        alert('Veuillez remplir le champ de saisie du post')
        return
      }
      const formData = new FormData()
      formData.append("image", this.file)
      formData.append("content", this.inputContent.toString())
      axios.post("https://social-network-gn.herokuapp.com/api/post/create", formData, { headers: { "Authorization":"Bearer " + localStorage.getItem("token")}})
                .then(()=> {
                    this.inputContent = ""
                    this.file = null
                    alert('publication réussie!')
                    location.reload();
                })
        .catch((error) => {
          alert(error.status);
          console.log(error);
        });
    },
    commentPage(postId) {
      const formData = new FormData()
      formData.append("content", this.commentContent.toString())
        axios.post("https://social-network-gn.herokuapp.com/api/post/"+ postId +"/comment", formData, { headers: {"Authorization": "Bearer " + localStorage.getItem("token")} })
        .then(()=> {
                    this.commentContent = ""
                    location.reload();
                })
        .catch((error)=> { console.log(error) 
        })
    },
    deletepost(postId) {
            let confirmpostDeletion = confirm("voulez-vous vraiment supprimer cette image ? Tous les commentaires associés seront également supprimés.");
            if (confirmpostDeletion == true) {
                axios.delete("https://social-network-gn.herokuapp.com/api/post/" + postId, 
                {headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
                })
                .then((res)=> {
                  console.log(res)
                  location.reload()
                })
                .catch((error) => { 
                  console.log(error)})
            } else {
                return
            }
    },
    deleteComment(commentId,postId) {
            let confirmpostDeletion = confirm("Voulez-vous vraiment supprimer ce commentaire");
            if (confirmpostDeletion == true) {
                axios.delete("https://social-network-gn.herokuapp.com/api/post/" + postId + "/comment/"+ commentId, 
                {headers: {"Authorization": "Bearer " + localStorage.getItem("token")}
                })
                .then((res)=> {
                  console.log(res)
                  location.reload()
                })
                .catch((error) => {
                  console.log(error)})
            } else {
                return
            }
    },
    localClear() {
        localStorage.clear();
        router.push({ path : "/" });
    },
    modifypost(postId) {
          if (this.inputUsername!=''){
            if (this.inputUsername.length >= 13 || this.inputUsername.length <= 4) {
              return this.invalid='Pseudo invalide (doit comporter 4 à 12 caractères)';
            }
          } 
            axios.put('https://social-network-gn.herokuapp.com/api/user/' + postId, {
            username: this.inputUsername,
            email: this.inputEmail,
            password: this.inputPassword,
            bio:this.inputBio,
          },{ headers: {"Authorization": "Bearer" + localStorage.getItem("token")} })
          .then(() => {
            alert("Modification réussie !");
            location.reload();
          })
          .catch((error) => {
            alert(error.status);
            console.log(error);
          });  
        },
  }
}
</script>

<style scoped>
@media screen and (min-width: 700px) {
  .post{
    width:35em;
    margin:auto;
  }
  form{
     width:35em;
     margin:auto;
  }
}
section{
  margin:0 2em 0 2em;
}
article{
  width:100%; 
}
.post__hour{
  font-style: italic;
}
.post__date{
  display:flex;
}
.post__header{
  display:flex;
  justify-content: space-between;
  font-size:0.8em;
  color:rgb(255, 179, 179);
  
}
.profile__img{
  width:3em;
  height:3em;
  border-radius: 50%;
  overflow: hidden;
  margin-right:1em;
  cursor:pointer;
}
.profile__img img{
  height:100%;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-20%);
  opacity: 0;
}
.post__subsection{
  display:flex;
  justify-content: center;
  color:#fd2b01ab;
  cursor:pointer;
  font-style: normal;
}
.post__comments:hover, .post__React:hover{
  background-color:rgba(192, 192, 192, 0.116);
}
.post__comments,.post__React{
  padding:1em 0 1em 0;
  width:50%;
  display:flex;
  justify-content: center;
}
.post__comments i,.post__React i{
  margin-left:0.5em;
}
.sendCom__btn{
  display: flex;
  border:none;
  background: #fd2b01ab;
  border-radius:1em;
  padding:0.5em;
  color:white;
}
.comment{
  display:flex;
  flex-direction: column;
  background-color: rgba(184, 184, 184, 0.151);
  border-radius: 2em;
  margin-bottom:0.5em;
}
.comment__user{
  font-weight:900;
  margin-left:1.5em;
}
.comment__hour{
  position: relative;
  margin-right:2em;
  font-size:0.8em;
  color:lightgrey;
}
.comment__content{
  margin-left:2em;
  padding:0.2em 0em 0.5em 0em;
}
.comment__date{
  display:flex;
  justify-content: space-between;
  padding-top:1em;
}
.comment_wrap{
  margin-top:1em;
}
.createCard{
  width:80%;
}
h1{
  margin:1em;
  font-family: Trebuchet MS ;
}
.post__user{
  font-weight: 900;
  font-size: 1.1em;
  margin-bottom: 0.2em;
  cursor:pointer;
}
.post__content{
  font-size:1.2em;
  margin:1em 0em 1em 0em;
  cursor:pointer;
}
.post{
  margin:0em 1em 2em 1em;
  border:1px solid rgba(116, 116, 116, 0.171);
  border-radius:0.8em;
  padding:1em;
}
.post__bar{
  display:flex;
}
.fa-trash,.fa-edit{
  color:#fd2b01ab;
  cursor:pointer;
  font-size:1.4em;
  margin-right:0.2em;
}
.fa-trash:hover,.fa-edit:hover{
  color:#fd2b01ab;
}
.icons__post{
  display: flex;
}
textarea::-webkit-scrollbar {
    width: 1em;
}
textarea::-webkit-scrollbar-thumb {
  border: 5px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
  border-radius: 999em;
  background-color: #aaaaaa;
}
.post__btn{
  z-index: 3;
  border:none;
  background: #fd2b01ab;
  border-radius:1em;
  padding:0.5em;
  color:white;
}
.post__btn:hover{
  background: #c92201ab;
}
.label__post{
  display:flex;
  justify-content: space-between;
  color:#fd2b01ab;
  cursor:pointer;
  font-style: normal;
}
.delete__comment i{
  position:absolute;
  font-size:1.5em;
  z-index: 5;
  bottom:-0.1em;
  color:#fd2b01ab;
  cursor:pointer;
  font-style: normal;
}
.label__file:hover, .label__post:hover{
  color:#c92201ab;
  cursor:pointer;
}
.box__message {
  border-radius: 1em;
  width:100%;
  height:5em;
  padding: 1em 0.5em 1em 0.5em;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 1em;
  border-bottom-color: rgba(0,0,0,.42);
  resize: none;
  outline: none;
}
.box__comment{
  border-radius: 5em;
  width:100%;
  height:4em;
  padding: 1em;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 0.8em;
  border-bottom-color: rgba(0,0,0,.42);
  resize: none;
  outline: none;
}
#previewImg{
  height:10em;
  margin-top:1em
}
.uploading-image{
     display:flex;
     display:none;
  }
.container{
  display:flex;
  flex-direction: column;
  align-items: center;
  margin:0;
}
#main-feed{
  display:flex;
  flex-direction: column;
  align-items: center;
}

section{
  margin-bottom: 2em;
}
.user-container{
  display: flex;
  justify-content: flex-end;
}
.post__img{
  width:100%;
  cursor:pointer;
}
.post__img img{
  width:100%;
}
</style>