<!-- Composant Bar de Navigation -->

<template>
    <nav class="navbar">
            <router-link class="link" to="/feed">
                <i class="fa fa-fw fa-home"></i> <p>Accueil</p>
            </router-link>
            <a href="mailto:contact@test.com">
                <i class="fa fa-fw fa-envelope"></i>
                <p>Contact</p>
            </a> 
            <router-link class="link" to="/profil">
                <i class="fa fa-fw fa-user"></i>
                <p>Profil</p>
            </router-link>
            <a @click="localClear">
                <i class="fas fa-door-open"></i> 
                <p>Se déconnecter</p>
            </a>
    </nav>
</template>

<script>
import router from "../router";
export default {
    name: "Navi",
    methods:{
        localClear() {
        localStorage.clear();
        this.$emit('logout');
        router.push({ path : "/login" });
        }
    }
}

</script>
<style scoped>
a{
    color:#fd2b01ab;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.navbar {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 3em;
    box-shadow: 0 1.2em 1.2em -0.9em rgba(128, 128, 128, 0.185);
}
.navbar a {
    float: left;
    padding: 12px;
    color: #fd2b01ab;
    text-decoration: none;
    font-size: 17px;
}

a:hover{
    color: #be2303ab;
}
</style>