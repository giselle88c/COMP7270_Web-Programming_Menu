<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();

const staff = ref({
    Username: '',
    Password: '',
    Gender: '',
    Age: '',
    Email: '',
    Address:'',
    Telephone:''
})

onMounted(async () => {
    // if there is an id in the route
    if (route.params.id) {
        await getStaff();
    }


});
const submitStaff = async function () {
    // post the booking to the backend
    var url = '/api/customer';
var method = 'POST';

if (route.name == 'update-staff') {
    url = url + '/' + staff.value._id;
    method = 'PUT';
}

// submit the booking to the backend
const response = await fetch(url, {
    method: method,
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(staff.value)
});
    // convert the response to json
    
    const json = await response.json();
    // log the json
    console.log(json);
    // alert the user
    //alert(JSON.stringify(json));
    alert("Account created successfully!");
    router.push("/");
}

/*
const deleteStaff = async function () {
    // post the booking to the backend
    const response = await fetch('/api/staffs/' + staff.value._id, {
        method: 'DELETE'
    });
    // convert the response to json
    const json = await response.json();
    // log the json
    console.log(json);
    // alert the user
    alert(JSON.stringify(json));
    // redirect to the home page
    router.push('/');
}
// a function to get the booking from the backend
const getStaff = async function () {
    // get the booking from the backend
    const response = await fetch('/api/staffs/' + route.params.id);
    // convert the response to json
    const json = await response.json();
    // log the json
    console.log(json);
    // set the booking
    staff.value = json;
}
*/
</script>

<template>
    <main>
        <form class="container my-5" @submit.prevent="submitStaff">
            <h1>Japanese Food Restaurant</h1>
            <h2>Registration</h2>
            <br>
            <div class="row mb-3 align-items-center">
                <div class="col-3">
                    <label for="inputName" class="col-form-label">Username</label>
                </div>
                <div class="col-5">
                    <input class="form-control" id="inputName" v-model="staff.Username" required>
                </div>
            </div>
            <div class="row mb-3 align-items-center">
                <div class="col-3">
                    <label for="inputPassword" class="col-form-label">Password</label>
                </div>
                <div class="col-5">
                    <input class="form-control" id="inputPassword" v-model="staff.Password" required>
                </div>
            </div>

            <div class="row mb-3 align-items-center">
                <div class="col-3">
                    <label for="inputGender" class="form-label">Gender</label>
                </div>
                <div class="col-5">
                    <select class="form-select" id="autoSizingSelect" v-model="staff.Gender">
                        <option selected>Choose...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
            </div>

            <div class="row mb-3 align-items-center">
                <div class="col-3">
                    <label for="Age" class="form-label">Age</label>
                </div>
                <div class="col-5">
                    <select class="form-select" id="autoSizingSelect" v-model="staff.Age">
                        <option selected>Choose...</option>
                        <option value="< 20">&lt; 20</option>
                        <option value="21-30">21-30</option>
                        <option value="31-40">31-40</option>
                        <option value="41-50">41-50</option>
                        <option value=">50">&gt; 50</option>
                    </select>
                </div>
            </div>

            <div class="row mb-3 align-items-center">
                <div class="col-3">
                    <label for="inputEmail" class="form-label">Email</label>
                </div>
                <div class="col-5">
                    <input class="form-control" id="inputEmail" v-model="staff.Email" required>
                </div>
            </div>

            <div class="row mb-3 align-items-center">
                <div class="col-3">
                    <label for="inputAddress" class="form-label">Address</label>
                </div>
                <div class="col-5">
                    <input class="form-control" id="inputAddress" v-model="staff.Address" required>
                </div>
            </div>

            <div class="row mb-3 align-items-center">
                <div class="col-3">
                    <label for="inputTelephone" class="form-label">Telephone</label>
                </div>
                <div class="col-5">
                    <input class="form-control" id="inputTelephone" v-model="staff.Telephone" required>
                </div>
            </div>

            <br>
            <button type="submit" class="btn btn-primary" v-if="route.name == 'staff-register'">Register</button>

        </form>
    </main>
</template>


<style>
.container {
  max-width: 600px;
}

.row {
  margin-bottom: 1rem;
}

.form-control {
  border-radius: 2;
}

.form-select {
    position: center;
  color: #000000;
  width: 150px;
  height: 40px;
  border-radius: 16px;
  border: none;
  background-color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  border: 2px solid #000000; /* Change the border color to black */
}
h1 {
  font-family: Arial, sans-serif;
  color: #f6f6f6;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  font-size: 40px;
}

h2 {
  font-family: Arial, sans-serif;
  color: #f6f6f6;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  font-size: 40px;
}

label {
  font-family: Arial, sans-serif;
  color: #faf9f9;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  font-size: 16px;
}

input, select {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  font-family: Arial, sans-serif;
  color: #f8f7f7;
  font-size: 14px;
}

button {
  font-family: Arial, sans-serif;
  font-size: 16px;
}
</style>