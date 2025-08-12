am5.ready(function () {

    // Create root and chart
    var root = am5.Root.new("chartdiv_map");
    var chart = root.container.children.push(
        am5map.MapChart.new(root, { wheelY: "none" })
    );

        // Title
var title = chart.children.push(am5.Label.new(root, {
    text: "Votes from Hong Kong Districts",
    x: am5.percent(50),
    centerX: am5.percent(50),
    fontSize: 20,
    y: 5,
   
}));

    var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_hongKongHigh,
            valueField: "value",
            calculateAggregates: true,
            y:20
        })
    );

        
        let dis_arr = [];

        for (i=0;i<JSONdata_Dis.length;i++){
            dis_arr.push({id: JSONdata_Dis[i].substring(0,5), value:JSONdata_Dis_count[i]});
        }

        //document.write(dis_arr[0].id+" "+dis_arr[0].value);
        
    polygonSeries.data.setAll(dis_arr);


    polygonSeries.set("heatRules", [{
        target: polygonSeries.mapPolygons.template,
        dataField: "value",
        min: am5.color("#C7FFFF"),
        max: am5.color("#054493"),
        key: "fill"
    }]);

    
    polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}: {value} votes"
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
        fill: root.interfaceColors.get("primaryButtonHover")
    });





})