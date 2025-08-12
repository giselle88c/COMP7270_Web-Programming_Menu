<script setup>
import { ref,onMounted } from "vue";

const options = ref({});
const series = ref([]);

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

const thisYear=new Date().getFullYear();

  
onMounted(async () => {
    var response = await fetch("/api/surveyStat?chart=bar");
    var json = await response.json();

    var data_year=  json.map((item) => item._id.date.year);
    var data_month=  json.map((item) => item._id.date.month);
    //options.value = { labels: json.map((item) => item._id) };
    //series.value = json.map((item) => item.Q_LikeMovie_Y);
   //options.value={labels:['Yes','No']};
    //series.value= [json.Q_LikeMovie_Y,json.Q_LikeMovie_N];
//labels= ["Apple", "Mango", "Banana", "Papaya", "Orange"]
    console.log(json);

    series: []


    series.value= [
          //data: [400, 430, 448, 470]
          //data: json.AgeGen[0].map((item) => item.total)
          {
            name: "selling amount",
            data: json.map((item) => item.amount)
          }
        ];
    options.value= {
            chart: {
              type: 'bar',
              height: 350
            },

            plotOptions: {
              bar: {
                borderRadius: 4
              }
            },
            dataLabels: {
              enabled: true,
              
            },
            colors: ["#5f6fd6","#df6f9b"],
            xaxis: {
              title: {
            text: 'Amount' ,
            style: {
      fontSize:  '18px',
    }       
        },
              categories: data_month.map((item) => months[item-1])
            },
            yaxis: {
          title: {
            text: 'Purchasing amount in '+thisYear,
            style: {
      fontSize:  '18px',
    }      
        }}
        
          };
});


</script>

<template>
    <div>
        <apexchart type="bar" :options="options" :series="series"  />
    </div>
</template>