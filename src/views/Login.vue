<template>
  <main>
    <section>  
      <form class="formcard" @submit.prevent="login">
        <div class="form-container">
            <input v-on:keydown="isInvalid = false" v-model="inputEmail" type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="votre email">
        </div>
        <div class="form-container">
            <input v-on:keydown="isInvalid = false" v-model="inputPassword" type="password" class="form-control" id="inputPassword" aria-describedby="passwordHelp" placeholder="votre mot de passe">
            <button type="submit">SE CONNECTER</button>                       
        </div>
        
        <router-link to="/register">Pas de compte ? S'incrire</router-link>
      </form> 
    </section>
    <div class="invalid" v-show="isInvalid">
          Veuillez vérifier vos informations de connexion
    </div>
  </main>
</template>

<script>
import axios from "axios";
import router from "../router";
export default {
  data() {
    return {
      inputEmail: "",
      inputPassword: "",
      isInvalid: false,
    };
  },
  methods: {
    login() {
      axios
        .post("https://social-network-gn.herokuapp.com/api/user/login", {
          email: this.inputEmail,
          password: this.inputPassword,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userId", res.data.userId);
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("isAdmin", res.data.isAdmin);
          this.$emit('login');
          window.alert(
            "connexion réussie, redirection vers la page principale"
          );
          router.push({ path: "/feed" });
        })
        .catch((error) => {
          this.isInvalid = true;
          console.log(error);
        });
    },
  },
};
</script>
<style scoped>

section{
  display:flex;
  justify-content: center;
  align-items: center;
  margin:auto;
  padding:1em;
  width:90%;
}
.formcard{
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin:auto;
  padding:1em;
}
input{
  border:none;
  padding:1em;
  margin-bottom:1em;
  width: 100%;
  border: 0.05em solid rgba(0, 0, 0, 0.267);
  color:#2c3e50;
  border-radius: 2em;
  outline:none;
}
.form-container{
  width:80%;
}
input:focus{
  box-shadow: 0 0 0.2em 0.1em #fd2b017a;
}
button{
  border:none;
  background-color:#fd2d01;
  color:white;
  font-weight: 600;
  padding:1em;
  width: 100%;
  margin-bottom: 1em;
  border-radius: 2em;
  cursor:pointer;
}
.invalid{
  display:flex;
  justify-content:center;
  color:red;
}
</style>