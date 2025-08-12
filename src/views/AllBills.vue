<script setup>

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { ref, onMounted, watch } from "vue";

import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";


import { jwtDecode } from "jwt-decode";

const search = ref("1");



watch(() => search.value, () => {
    console.log("search " + search.value);
    loadAsyncOrder();
});


const Username = ref("Guest");
const role = ref("");

const data = ref([]);
const total = ref(0);
const loading = ref(false);
const sortField = ref("");
const sortOrder = ref("");
const defaultSortOrder = ref("desc");
const page = ref(1);
const perPage = ref(20);


const loadAsyncOrder = () => {
    // Get the token from local storage    
    const token = localStorage.getItem('token');
    // decode jwt token
    const decoded = jwtDecode(token);
    console.log(decoded);
    Username.value = `${decoded.Username}`;
    role.value = `${decoded.role}`;

    const params = [

        `BillNo=${search.value}`,
        //`sort_by=${sortField.value}.${sortOrder.value}`,
        `page=${page.value}`,
    ].join("&");
    console.log("params " + params);
    loading.value = true;
    fetch(`api/admin/getOrders?${params}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        .then((response) => response.json())
        .then((result) => {
            perPage.value = result.perPage;
            total.value = result.total;
            data.value = result.orders;
            loading.value = false;
        })
};


/*
 * Handle page-change event
 */
const onPageChange = (p) => {
    page.value = p;
    loadAsyncOrder();
};



/*
 * Type style in relation to the value
 */
const type = (value) => {
    const number = parseFloat(value);
    if (number < 6) {
        return "is-danger";
    } else if (number >= 6 && number < 8) {
        return "is-warning";
    } else if (number >= 8) {
        return "is-success";
    }
};



async function editItem(item) {


    var a = prompt("QRT set to", "");

    if (a != null && parseInt(a) > 0) {
        // Get the token from local storage    
        const token = localStorage.getItem('token');
        // decode jwt token
        const decoded = jwtDecode(token);
        console.log(decoded);
        Username.value = `${decoded.Username}`;
        var newPrice=parseFloat(item.Price + (a-item.Qty)*parseFloat(item.Price/item.Qty));
        // Post the booking to the backend
        const response = await fetch('/api/admin/updateOrder/' + item._id, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' // Specify the content type as JSON
            },
            body: JSON.stringify({ Qty: a, Price: newPrice }) // Convert the body object to a JSON string
        });

        // Convert the response to JSON
        const json = await response.json();

        // Log the JSON
        console.log(json);

        // redirect to the home page
        //router.push('/');
        alert("Item modified to " + a);
        loadAsyncOrder();


    }
}

const deleteItem = async function (item) {

    if (confirm(`Are you sure you want to delete this item:` + item._id + `?`)) {

        // Get the token from local storage    
        const token = localStorage.getItem('token');
        // decode jwt token
        const decoded = jwtDecode(token);
        console.log(decoded);
        Username.value = `${decoded.Username}`;

        // post the booking to the backend
        const response = await fetch('/api/admin/deleteOrder/' + item._id,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
        // convert the response to json
        const json = await response.json();
        // log the json
        console.log(json);
        // redirect to the home page
        //router.push('/');
        loadAsyncOrder();
    }
}

search.value = "";

</script>

<template>



    <div v-if="route.name == 'AllBills'" class="container my-4">

        <input class="form-control" v-model="search" placeholder="Enter Bill No." />
        <br>
        <section class="col-12 card">
            <o-table :data="data" :loading="loading" paginated backend-pagination :total="total" :per-page="perPage"
                backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]"
                aria-next-label="Next page" aria-previous-label="Previous page" aria-page-label="Page"
                aria-current-label="Current page" @page-change="onPageChange">

                <o-table-column v-slot="props" field="Username" label="Username">
                    {{ props.row.Username }}
                </o-table-column>
                <o-table-column v-slot="props" field="BillNo" label="BillNo">
                    {{ props.row.BillNo }}
                </o-table-column>
                <o-table-column v-slot="props" field="FoodName" label="FoodName">
                    {{ props.row.FoodName }}
                </o-table-column>
                <o-table-column v-slot="props" field="Qty" label="Qty">
                    {{ props.row.Qty }}<img v-bind:src="'src/images/pencil.png'" alt="Delete" style="width:20px"
                        @click="editItem(props.row)">
                </o-table-column>


                <o-table-column v-slot="props" field="Cast" label="Delete">
                    <img v-bind:src="'src/images/delete.png'" alt="Delete" style="width:20px"
                        @click="deleteItem(props.row)">
                </o-table-column>

            </o-table>
        </section>
    </div>



</template>

<style scoped>
.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    font-size: 10px;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 100px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
