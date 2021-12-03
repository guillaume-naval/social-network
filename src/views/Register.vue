<template>
  <main class="container">
    <section>
      <h1>INSCRIPTION</h1>
      <div v-show="invalid!=null" class="invalid_txt" key="invalid">
          <p>{{invalid}}</p>
      </div>
      <form @submit.prevent="sendDataForm(event)" >
        
        <div>
          <label for="inputUsername">Nom d'utilisateur</label>
          <input
            v-model="inputUsername"
            type="text"
            aria-describedby="usernameHelp"
            placeholder="Votre pseudo"  
            minlength="4"
          />
        </div>
        <div>
          <label for="inputEmail">Email</label>
          <input
            v-model="inputEmail"
            type="email"
            aria-describedby="emailHelp"
            placeholder="Votre email"            
          />
        </div>
        <div>
          <label for="inputPassword">Mot de passe</label>
          <input
            v-model="inputPassword"
            type="password"
            id="inputPassword"
            aria-describedby="passwordHelp"
            placeholder="Votre mot de passe"
            autocomplete="new-password"
          />
        </div>
        <button type="submit">S'inscrire</button>
        <router-link to="/login">
        Déjà inscrit ? S'identifier
        </router-link>
      </form>
        
     
    </section>
  </main>
</template>

<script>
import axios from "axios";
import router from "../router";
export default {
  name: "Inscription",
  data() {
    return {
      inputUsername: "",
      inputEmail: "",
      inputPassword: "",
      invalid: "",
    };
  },
  methods: {
    sendDataForm() {
      
      const emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|("."+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const passRegex = /^(?=.*\d).{4,15}$/
      if ( !this.inputUsername || !this.inputEmail || !this.inputPassword ) {
                return this.invalid='Veuillez remplir tous les champs';
      }
      if (this.inputUsername.length >= 13 || this.inputUsername.length <= 4) {
        return this.invalid='Pseudo invalide (doit comporter 5 à 12 caractères)';
      }
      if (!emailRegex.test(this.inputEmail)) {
        return this.invalid="L'email n'est pas valide";
      }
      if (!passRegex.test(this.inputPassword)) {
        return this.invalid="Le mot de passe n'est pas valide (doit comporter 4 à 15 caractères et inclure au moins 1 chiffre)";
      }
      if (this.inputEmail == '' || this.inputUsername == '' || this.inputPassword == '') {
        return this.invalid='Un des champs est invalide';
      }
      
      axios.post("https://social-network-gn.herokuapp.com/api/user/signup", {
          username: this.inputUsername,
          email: this.inputEmail,
          password: this.inputPassword,
        })
        .then(() => {
          alert("Inscription réussie, redirection vers le module de connexion");
          router.push({ path: "/login" });
        })
        .catch((error) => {
          alert(error.status);
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
*,
*::after,
*::before {
    margin: 0;
    padding: 0;
}
.container{
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
section{
  margin-top:3em;
  width:20em;
}
form{
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:100%;
}
form div{
  display:flex;
  flex-direction: column;
  width:100%;
}
input{
  outline: none;
  border-radius: 2em;
  border:none;
  padding:0.5em;
  width:100%;
  margin-bottom:1em;
  border: 0.05em solid rgba(0, 0, 0, 0.267);
  color:#2c3e50;
}
input:focus{
  box-shadow: 0 0 0.2em 0.1em #fd2b017a;
}
button{
  border-radius: 2em;
  border:none;
  background-color:#fd2d01;
  color:white;
  font-weight: 600;
  width: 100%;
  margin-bottom: 1em;
  padding: 1em 0em 1em 0em;
}
h1{
  margin-bottom: 0.5em;
}
.invalid_txt{
  color:red;
  font-style: italic;
  font-size:0.9em;
  margin-bottom:0.5em;
}
</style>