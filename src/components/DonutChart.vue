<script setup>

import { ref, onMounted } from "vue";

const options = ref({});
const series = ref([]);

onMounted(async () => {
    var response = await fetch("/api/surveyStat?chart=donut");
    var json = await response.json();

    console.log("._id.FoodName",json[1]._id.FoodName);


    options.value = {
        labels: json.map((item) => item._id.FoodName),
    title: {
    text: 'Monthly report on favourite menu',
    style: {
      fontSize:  '16px',
    }
  },

  
    };

    series.value = json.map((item) => item.Quantity);



    console.log(json);
});


</script>

<template>
    <div>
        <apexchart type="pie" :options="options" :series="series"  />
    </div>
</template>