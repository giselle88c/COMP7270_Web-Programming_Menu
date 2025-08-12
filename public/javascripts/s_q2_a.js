       
        am5.ready(function () {

            var root = am5.Root.new("chartdiv_heart1");
var chart = root.container.children.push(
am5percent.SlicedChart.new(root, {})
);



var series = chart.series.push(
am5percent.PictorialStackedSeries.new(root, {
    svgPath: heart,
    categoryField: "name",
    valueField: "value",
    orientation: "vertical",
    alignLabels: false,
    startLocation: 1-JSONdata_Rate[0]/5,
    endLocation: 1
})
);



series.labels.template.set("text", "[bold]{name}:{value}[/]");

series.slices.template.setAll({
tooltipText: "[bold]Story: {value}[/]",
fillOpacity: 0.7,
stroke: am5.color(0xffffff),
strokeWidth: 2
});

series.get("colors").set("colors", [

am5.color("#C31947")
]);

series.labels.template.set("rotation", 10);
series.slices.template.set("tooltipY", 75);

series.data.setAll([
       {
        name: "Story",
        value: JSONdata_Rate[0]
    }]);

});
