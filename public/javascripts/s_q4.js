


am5.ready(function() {


// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv_word");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

var zoomableContainer = root.container.children.push(
  am5.ZoomableContainer.new(root, {
    width: am5.p100,
    height: am5.p100,
    wheelable: true,
    pinchZoom: true
  })
);

var zoomTools = zoomableContainer.children.push(am5.ZoomTools.new(root, {
  target: zoomableContainer
}));


// Add series
// https://www.amcharts.com/docs/v5/charts/word-cloud/
var series = zoomableContainer.contents.children.push(am5wc.WordCloud.new(root, {
  maxCount:100,
  minWordLength:2,
  maxFontSize:am5.percent(35),
  text: JSONdata_Words
}));


// Configure labels
series.labels.template.setAll({
  paddingTop: 5,
  paddingBottom: 5,
  paddingLeft: 5,
  paddingRight: 5,
  fontFamily: "Courier New"
});

}); // end am5.ready()
