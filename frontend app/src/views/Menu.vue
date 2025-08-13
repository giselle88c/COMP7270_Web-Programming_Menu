<script setup>

const Username = ref("Guest");

import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { ref, onMounted, watch, computed, provide, inject } from "vue";

import { jwtDecode } from "jwt-decode";

const MenuItems = ref([])
const CheckItems = ref({});
const Cart_TotalPrice = ref(0);
//const ItemFields = ['id', 'name', 'price', 'quantity'];

const formattedDate = ref("");
const date = ref(new Date());
const TodaysItems = ref({});
var response = {};
var json = "";
var FoodCount = 0;

var total_order_price = 0;


var myOrders = [];
var noOfBills = 0;
var perPage = 2;
var pages = 0;
var pageNo = 1;

onMounted(async () => {


    if (FoodCount == 0) {
        //load food data
        response = await fetch('/api/getFood');
        // convert the response to json
        json = await response.json();
        // log the json
        console.log(json.food);
        MenuItems.value = json.food;
        FoodCount = json.food.length;

        //update today's item
        date.value = new Date();
        formattedDate.value = date.value.toDateString();
        //TodaysItems.value = MenuItems.value[(parseInt(date.value.getDate()) % FoodCount)];
        TodaysItems.value = MenuItems.value[(parseInt(date.value.getDate()) % FoodCount)]


        loadMyBills();

    }


});
const loadMyBills = async function () {
    //has log in token
    if (localStorage.getItem('token')) {
        // Get the token from local storage    
        const token = localStorage.getItem('token');
        console.log(token);
        // decode jwt token
        const decoded = jwtDecode(token);
        console.log(decoded);
        Username.value = `${decoded.Username}`;

        //load my bills data
        response = await fetch('/api/orders/myOrders?Username=' + Username.value, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });


        if (!response.ok) {
            throw new Error(response.statusText);
        }

        // convert the response to json
        json = await response.json();
        // log the json
        console.log("checkItems:", json.orders);
        myOrders = json.orders;
        noOfBills = json.orders.length;
        pages = Math.ceil(noOfBills / perPage);

        changePage(1);
    }
}


watch(() => route.params.date, () => {
    if (route.params.date) {
        date.value = new Date(route.params.date);
    } else
        date.value = new Date();

    formattedDate.value = date.value.toDateString();
    console.log("update date: " + date.value);


    TodaysItems.value = MenuItems.value[(parseInt(date.value.getDate()) % FoodCount)];




});




//provide('cart', ref([]));
//const cartItems = ref(inject('cart'));
const cartItems = ref([]);
const cartItems_name = ref([]);
const cartItems_price = ref([]);

const header = ref("Select food to cart")

const selected = computed(() => {
    return (FoodID) => {
        console.log(cartItems.value.includes(FoodID))
        return cartItems.value.includes(FoodID)

    };
});



const FoodQty = computed(() => {
    return (FoodID) => {
        console.log("food Qty:", cartItems.value.indexOf(FoodID))
        return cartItems.value.filter(element => element == FoodID).length;
    };
});

const index = cartItems.value.indexOf(route.params.id);
if (index > -1) { // only splice array when item is found
    cartItems.value.splice(index, 1); // 2nd parameter means remove one item only
}





const addToCart = function (item) {
    //console.log(item);
    cartItems.value.push(item.FoodID);
    cartItems_name.value.push(item.FoodName);
    cartItems_price.value.push(item.Price);
    Cart_TotalPrice.value = parseInt(Cart_TotalPrice.value) + parseInt(item.Price);
    console.log("TotalPrice", Cart_TotalPrice.value);

    console.log("itemPrice", item.Price);
    console.log("AddToCart");
    console.log(cartItems.value);
    header.value = item.FoodName + " has been added to cart!";
};

const removeFromCart = function (item) {

    const index = cartItems.value.indexOf(item.FoodID);
    console.log(item.FoodID);
    console.log(index);
    if (index > -1) { // only splice array when item is found
        cartItems.value.splice(index, 1); // 2nd parameter means remove one item only
        cartItems_price.value.splice(index, 1); // 2nd parameter means remove one item only
        cartItems_name.value.splice(index, 1); // 2nd parameter means remove one item only

        Cart_TotalPrice.value = Cart_TotalPrice.value - parseInt(item.Price);
        header.value = item.FoodName + ", Qty:1 has been removed!";

    }



};


const CheckOut = async function () {


    var url = '/api/CheckOut';


    var result = { 'cartItems': cartItems_name.value, 'cartItem_price': cartItems_price.value, 'Username': Username.value, 'TotalPrice': Cart_TotalPrice.value };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
    });
    loadMyBills();
    router.push("/")
}


const changePage = function (pageNo) {

    if (pageNo == pages) //last page
        CheckItems.value = myOrders.slice(perPage * pageNo - 2, perPage * (pageNo - 1) + noOfBills % perPage + 1);
    else
        CheckItems.value = myOrders.slice(perPage * pageNo - 2, perPage * pageNo);


    for (let item of CheckItems.value) {
        total_order_price = 0;
        for (let order of item.fromItems)
            total_order_price = parseInt(total_order_price) + parseInt(order.Price);

        item.TotalPrice = total_order_price;

    }
}
</script>

<template>


    <div id="home" v-if="route.name == 'home' || route.name == 'news'" class="container my-4">
        <h4>Welcome, </h4>
        <h4>{{ Username }} !</h4>
        <h3>Top Menu on {{ formattedDate }}</h3>

        <div>

            <table>
                <tr>
                    <td><img alt=" Vue logo" class="card align-middle" :src="`../src/images/${TodaysItems.Image}`"
                            width="200" height="300" /></td>
                </tr>
                <tr>
                    <td>
                        <h3>{{ TodaysItems.FoodName }}</h3>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>{{ TodaysItems.Description }}</p>
                    </td>
                </tr>

            </table>





        </div>

    </div>

    <div v-if="route.name == 'Menu'" id="home" class="container my-4">
        <h1>Menu</h1>
        <h2>{{ header }}</h2>

        <div class="row m-1">


            <div v-for="item in MenuItems" :key="item.FoodID" class="card col-4 align-middle">

                <img alt="food" :src="`src/images/${item.Image}`" @click="addToCart(item)" style="height:18vh" />
                <span class="text-center">{{ item.FoodName }}</span>
                <span class="text-center">HK${{ item.Price }}</span>

            </div>
        </div>
    </div>


    <div v-if="route.name == 'Cart'" class="container my-4">
        <h1>Cart</h1>
        <h2>{{ header }}</h2>


        <form @submit.prevent="CheckOut">
            <!-- cartItems is the output array of ALL cart items ID -->

            <input type="text" v-model="Username" hidden>



            <div v-for="item in MenuItems" :key="item.FoodID">

                <div v-if="selected(item.FoodID)" :key="item.FoodID">
                    <div class="row m-1">
                        <div class="card col-4 my-1">
                            <img class="align-middle" :src="`src/images/${item.Image}`" style="height:12vh"
                                @click="removeFromCart(item)" />
                        </div>
                        <div class="card col-4 my-1">
                            <span class="text-center">{{ item.FoodName }}</span>

                            <span class="text-center">HK${{ item.Price }}</span>

                            <span class="text-center">Qty: {{ FoodQty(item.FoodID) }}</span>
                        </div>

                    </div>
                </div>
            </div>


            <h3> Total: HK${{ Cart_TotalPrice }}</h3>
            <button v-if="Cart_TotalPrice > 0" type="submit" class="btn btn-warning">Check out</button>
        </form>



    </div>


    <div v-if="route.name == 'MyBill'" id="home" class="container m-1">
        <h2>User: {{ Username }}</h2>
        <div v-for="item in CheckItems" :key="item.OrderNo">
            <div class="card px-2 m-1">

                <table class="billTable">
                    <tr>
                        <td>
                            <b>Bill No.: </b>
                        </td>
                        <td><b># {{ item.BillNo }}</b>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <b>Date/Time: </b>
                        </td>
                        <td><b>{{ item.DateTime.toString().slice(0, 24) }}</b>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Total Price: </b>
                        </td>
                        <td><b>HK$ {{ item.TotalPrice }}</b>
                        </td>

                    </tr>
                </table>


                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Food</th>
                            <th scope="col">Quantity</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in item.fromItems">

                            <td>

                                {{ order.FoodName }}

                            </td>
                            <td>

                                {{ order.Qty }}

                            </td>



                        </tr>
                    </tbody>


                </table>
            </div>
        </div>
        <div class="btn btn-light" v-for="n in pages" @click="changePage(n)"> PAGE {{ n }} </div>

    </div>


</template>

<style scoped>
header {

    line-height: 1.5;
    max-height: 80vh;

}

h1 {

    font-weight: 500;
    font-size: 4.2rem;
    position: relative;
    top: 10px;
    color: rgb(248, 246, 243);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

h2 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    color: rgb(243, 237, 237);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

h3 {
    font-weight: 500;
    font-size: 1.6rem;
    position: relative;
    color: rgb(249, 247, 251);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

h4 {
    font-family: "italic";
    font-weight: 500;
    font-size: 4.0rem;
    position: relative;
    color: #fdf9fa;
    text-decoration: none;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

}

p {
    font-family: "italic";
    font-weight: 300;
    font-size: 1.4rem;
    position: relative;
    color: rgb(252, 252, 252);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
