am5.ready(function() {


    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("chartdiv_bar");
    
    
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "none",
      paddingLeft: 0,
      layout: root.verticalLayout,
      y:15
    }));
    
     // Title
     var title = chart.children.push(am5.Label.new(root, {
      text: "Age & Gender Propulation",
      fontSize: 20,
      y: -10,
      x: am5.percent(50),
      centerX: am5.p50,
      background: am5.Rectangle.new(root, {
          fill: am5.color(0xffffff),
          fillOpacity: 0.7
      })}));

    chart.get("colors").set("colors", [
      am5.color("#2DA9CE"),
      am5.color("#3855C0")
    ]);
    
    var data=JSONdata_AgeGen;
    // add bullet icon links to the age Gender Object
    for (i=0; i<data.length;i++){
      data[i]['bulletSettings']={ src: "../images/boy.png" };
      data[i]['bulletSettings2']={ src: "../images/girl.png" };

    }
    
    /*
    var data = [{
      "age": "<20",
      "male": 2.5,
      "female": 2.5,
      bulletSettings: { src: "https://www.amcharts.com/lib/images/faces/A04.png" },
      bulletSettings2: { src: "../images/girl.png" }
    }] 
    */
    
    
    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true
    });
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "Age",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {}),
      
    }));
    
    xRenderer.grid.template.setAll({
      location: 1
    })
    
    xAxis.data.setAll(data);
    
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })
    }));
    
    
    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    var legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }));
    
    
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name, fieldName) {
      var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        stacked: true,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: "Age",
        
      }));
    
      series.columns.template.setAll({
        tooltipText: "{name} ages {categoryX}: {valueY} votes",
        tooltipY: am5.percent(10)
      });
      series.data.setAll(data);
    
      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();
    
      series.bullets.push(function () {
        if(name=='Male')
          bulletByGender="bulletSettings";
        else bulletByGender="bulletSettings2";

        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
          sprite: am5.Picture.new(root, {
            templateField: bulletByGender,
            width: 30,
            height: 30,
            centerX: am5.p50,
            centerY: am5.p50,
            shadowColor: am5.color(0x000000),
            shadowBlur: 4,
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            shadowOpacity: 0.6
          })
        });
        
      });
    
      legend.data.push(series);
    }
    
    makeSeries("Male", "Male");
    makeSeries("Female", "Female");
    
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
    
    }); // end am5.ready()