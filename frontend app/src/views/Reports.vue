<script setup>

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

import { ref, onMounted, watch } from "vue";

import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap";

import BarChart from '../components/Bar.vue'
import DonutChart from '../components/DonutChart.vue'





const data = ref([]);
const total = ref(0);
const loading = ref(false);
const sortField = ref("");
const sortOrder = ref("");
const defaultSortOrder = ref("desc");
const page = ref(1);
const perPage = ref(20);
const score = ref({});
const analyseResult = ref("positive");
onMounted(async () => {

    //load food data
    let response = await fetch('/api/surveyStat');
    // convert the response to json
    let json = await response.json();
    // log the json
    console.log("getsurveydata");
    console.log(json)

});


const loadAsyncCM = () => {
    const params = [
        
        `analyseResult=${analyseResult.value}`,
        //`sort_by=${sortField.value}.${sortOrder.value}`,
        `page=${page.value}`,
    ].join("&");
    loading.value = true;
    fetch(`api/getComments?${params}`)
        .then((response) => response.json())
        .then((result) => {
            perPage.value = result.perPage;
            total.value = result.total;
            data.value = result.comments;
            loading.value = false;
            score.value=result.score[0];
            score.value.avg_positive=score.value.avg_positive.toFixed(2);
            score.value.avg_neutral=score.value.avg_neutral.toFixed(2);
            score.value.avg_negative=score.value.avg_negative.toFixed(2);

            console.log(score.value);
        })
};

/*
 * Handle page-change event
 */
const onPageChange = (p) => {
    page.value = p;
    loadAsyncCM();
};

const filterCM= function(value) {

    analyseResult.value=value;
}

watch(() => analyseResult.value, () => {
    loadAsyncCM();
});

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

analyseResult.value="";

</script>

<template>


    <div v-if="route.name == 'Report'" class="container my-4">
       

        <div class="container my-4">
            <div class="row text-center">

            </div>
            <div class="row">
                <div id="chartdiv_donut" class="col-12 card col-md-12 card" style="min-width:30vw; min-height:20vh ">

                    <DonutChart />

                </div>

            </div>

            <div class="row">
                <div id="chartdiv_bar" class="col-12 card col-md-12 card" style="min-width:30vw; min-height:40vh ">

                    <BarChart />
                </div>

            </div>


        </div>
    </div>



    <div v-if="route.name == 'Comments'" class="container my-4">

        
        <table class="table table-bordered billTable">
            
            <tr><td>
                    <img v-bind:src="'src/images/positive.png'" alt="positive" style="width:40px" @click="filterCM('positive')"/></td><td>{{score.avg_positive}}</td> 

            <td><img v-bind:src="'src/images/neutral.png'" alt="neutral" style="width:40px" @click="filterCM('neutral')"/></td><td>{{score.avg_neutral}}</td> 

            <td><img v-bind:src="'src/images/negative.png'" alt="negative" style="width:40px" @click="filterCM('negative')"/></td><td>{{score.avg_negative}}</td></tr>
            
    </table>



<section class="col-12 card">

    <o-table :data="data" :loading="loading" paginated backend-pagination :total="total" :per-page="perPage"
        backend-sorting :default-sort-direction="defaultSortOrder" :default-sort="[sortField, sortOrder]"
        aria-next-label="Next page" aria-previous-label="Previous page" aria-page-label="Page"
        aria-current-label="Current page" @page-change="onPageChange" >


        <o-table-column v-slot="props" field="Q2_word" label="Comments" >
            {{ props.row.comments }}
        </o-table-column>
        

    </o-table>
</section>
</div>


</template>

<style scoped>

.billTable {

font-weight: bold;
font-size: 1.7rem;
color:white;

}
.billTable.th, td {
padding-top: 10px;
padding-bottom: 10px;
padding-left: 5px;
padding-right: 5px;

}
</style>
