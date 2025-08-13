<script setup>

import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter, RouterView } from "vue-router";

import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";

import { jwtDecode } from "jwt-decode";
const Username=ref("Guest");
const role=ref("role");

import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-language-text";
const client = new TextAnalysisClient("https://comp7270-gis.cognitiveservices.azure.com/", new AzureKeyCredential("7a316a57c0ea433eae2e6be7d9e3fc00"));

const comments = ref("");

const router = useRouter();
const date = ref(new Date());
const analyseText = ref("");
const analyseResult = ref("positive")

onMounted(() => {
  if(localStorage.getItem('token'))
  {
    const token = localStorage.getItem('token');
        // decode jwt token
        const decoded = jwtDecode(token);
        console.log(decoded);
        Username.value = `${decoded.Username}`;
        role.value = `${decoded.role}`;
  }
});

const logout = function() {
  localStorage.removeItem('token');
  location.reload()
  router.push("/")
}

const submitComment = async function () {

    await analyse();
    console.log('result: (cm)');
    var result = {'comments': comments.value,'analyseResult':analyseResult.value,'analyseText':analyseText.value};
    console.log(result);
    // submit the comment form to the backend
    var url = '/api/comment';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
    });
    comments.value="";
    router.push("/");

}


const analyse = async function () {
    if(comments.value!= null && comments.value != '')
    {
    const documents = comments.value.split(".");

    const results = await client.analyze("SentimentAnalysis", documents);
    const onlySuccessful = results.filter((result) => result.error === undefined);
    analyseResult.value = onlySuccessful[0].sentiment.toString();
    analyseText.value = onlySuccessful[0].confidenceScores;
    console.log(analyseText.value)
    } else alert("Please enter value!")
};


watch(() => date.value, () => {

    console.log("push " + (date.value).toDateString())
    router.push("/news/" + (date.value).toDateString())

});

const attributes = ref([
    {
        key: 'public holiday',
        highlight: 'red',

        dates: [
            new Date(2024, 3, 1),
            new Date(2024, 3, 4)
        ],

    },
    {
        key: 'today',
        highlight: 'blue',
        dates: new Date()
    }
]);



</script>

<template>

    <div id="home" class="container ">
        <div class="button-container">
      <div class="button-group">
        

        <RouterLink to="/" class="btn btn-outline-warning custom-button">Home</RouterLink>
        <RouterLink to="/Menu" class="btn btn-outline-warning custom-button">Menu</RouterLink>
        <RouterLink to="/Cart" class="btn btn-outline-warning custom-button">Cart</RouterLink>
        <RouterLink v-if="Username!='Guest'" to="/MyBill" class="btn btn-outline-info custom-button">My Bill</RouterLink>
        <RouterLink v-if="role=='Admin'" to="/AllBills" class="btn btn-outline-info custom-button">All Bills</RouterLink>
        <RouterLink to="/Report" class="btn btn-outline-warning custom-button">Report</RouterLink>
        <RouterLink to="/Comments" class="btn btn-outline-warning custom-button">Comments</RouterLink>
        <RouterLink to="/register" v-if="Username=='Guest'" class="btn btn-outline-warning custom-button">Register</RouterLink>
        <RouterLink to="/login" v-if="Username=='Guest'" class="btn btn-outline-warning custom-button">Login</RouterLink>
        <button type="button" v-if="Username!='Guest'" class="btn btn-outline-warning custom-button" @click="logout">Log Out</button>
      </div>
    </div>
        <br/>


        <div class="col-3 m-1" style="background-color: #ff0000 !important;">
  <VDatePicker v-model="date" mode="date" :attributes="attributes" />
</div>

        <div class="col-3 m-1">
            <form >
                <!-- cartItems is the output array of ALL cart items ID -->

                <div>
                    
                    <div>
                        <img alt="submit comment" class="btn" :src="`/src/images/${analyseResult}.png`" width="50" @click="submitComment" style="border: none;">  <h4  style="color: white;font-size: 15px;">Comments</h4>
</div>
                </div>
                <textarea type="text" rows="4" v-model="comments" placeholder="say something here" @change="analyse" />
                <textarea type="text" rows="4" v-model="analyseText" hidden></textarea>


            </form>

        </div>


    </div>

    
    <RouterView />
</template>

<style >
  body {
    background-image: url("src/images/pexels-rajesh-tp-2098085.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #000000;
}
.button-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.custom-background {
  background-color: rgba(237, 232, 232, 0);
}

.no-border {
    border: none;
  }

.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.custom-button {
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #fdf8f8;
  border: 2px solid #efeeee;
  border-radius: 5px;
  padding: 10px 20px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #f7f3ee;
  color: #300909;
}

.custom-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #f9f8f8;
}
</style>