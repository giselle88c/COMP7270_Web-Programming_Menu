<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';


import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";

const route = useRoute();
const router = useRouter();// imports
const Username=ref("Guest");

import { jwtDecode } from "jwt-decode";

// credentials
const credentials = ref({
  Username: '',
  Password: ''
});




onMounted(async () => {
  // if there is an id in the route
  if (route.params.id) {
    await getStaff();
  }

  if(localStorage.getItem('token')){
    // Get the token from local storage    
    const token = localStorage.getItem('token');
    console.log(token);
    // decode jwt token
    const decoded = jwtDecode(token);
    console.log(decoded);
    Username.value = `${decoded.Username}`;

  }

});
// methods
const login = async () => {
  try {
    // fetch
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials.value)
    });

    // response
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // save token to local storage
    localStorage.setItem('token', data.token);
    //alert(data.token);
    //redirect to homepage
    location.reload('/');

    
  } catch (error) {
    alert(error);
  }
}

// a function to get the booking from the backend
const getStaff = async function () {
  // get the booking from the backend
  const response = await fetch('/api/users/' + route.params.id);
  // convert the response to json
  const json = await response.json();
  // log the json
  console.log(json);

}


</script>



<template>
  <main>
    <form v-if="Username=='Guest'" @submit.prevent="login">
      <div class="form-group">
        <label for="inputName" class="col-sm-10 col-form-label">Username</label>
        <input class="form-control" id="inputName" v-model="credentials.Username">
      </div>
      <div class="form-group">
        <label for="inputPassword">Password</label>
        <input type="password" class="form-control" id="inputPassword" placeholder="Password"
          v-model="credentials.Password">
      </div>
      <br>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </main>
</template>


<style>
/* Modify page styles */


label {
  font-weight: bold;
  /* Add any additional label styles */
}

input[type="text"],
input[type="password"] {
  color: #010101;
  font-family: Arial, sans-serif;
  font-size: 16px;
  /* Add any additional input field styles */
}


main {
  padding: 100px;
}

/* Modify button styles */
.btn-primary {
  border-radius: 8px;
  border: 10px solid #010101;
  font-family: Arial, sans-serif;
  font-size: 16px;

  background-color: #fefdfd;
  color: #0c0c0c;
  border: none;
  font-size: 15px;
  padding: 10px 20px;
  cursor: pointer;
}

/* Optional: Modify form input styles */
.form-control {
  border-radius: 15px;
  padding: 10px;
  border: 6px solid #3f3e3e;
  width: 100%;

}
</style>