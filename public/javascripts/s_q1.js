am5.ready(function () {

    
    
    var root = am5.Root.new("chartdiv_movie");

    

    var chart = root.container.children.push(
        am5percent.SlicedChart.new(root, {})
    );




    var series = chart.series.push(
        am5percent.PictorialStackedSeries.new(root, {
            svgPath: moviePic,
            categoryField: "Q_LikeMovie",
            valueField: "A_LikeMovie",
            orientation: "horizontal",
            paddingTop: 10,

                
            
        }),
        
    );

    
    series.slices.template.setAll({
        tooltipText: "{A_LikeMovie} people say \"{Q_LikeMovie}\"",
        stroke: am5.color(0xffffff),
        strokeWidth: 2
    });

    series.get("colors").set("colors", [
        am5.color("#C31947"),
        am5.color("#36454F")
    ]);

    series.labels.template.set("rotation", 5);
    series.labels.template.set("fontSize", 20);
    
    series.ticks.template.set("location", 0.95);

    // Title
    var title = chart.children.push(am5.Label.new(root, {
    text: "[bold]Do you like the Moon Thieves?[/]",
    fontSize: 28,
    y: 120,
    fill: am5.color("#800020"),
    rotation: 5,
    

    
    //x: am5.percent(20),
    //centerX: am5.p50,
 }));

    /*
    series.data.setAll([{
        Q_LikeMovie: "YES",
        A_LikeMovie: 100
        }, {
            Q_LikeMovie: "NO",
            A_LikeMovie: 10,
        } ]);
        */
    series.data.setAll(JSONdata_LikeMovie);


});
