var w = 500,
    h = 500;

var colorscale = d3.scale.category10();

// Create event listener which takes data from VA
function onMessage(evt) {
    if (evt && evt.data && evt.data.hasOwnProperty("data"))
        updateData(evt.data);
}

if (window.addEventListener) {
    // For standards-compliant web browsers 
    window.addEventListener("message", onMessage, false);
} else {
    // For Internet Explorer 8 and earlier versions
    window.attachEvent("onmessage", onMessage);
}

// Load data into the chart with defined properties.
function updateData(chartData) {

    var sourceArray = [];
    var d = [];
    var tempArray = [];
    var tempArray2 = [];
    var legendOptions = [];
    var axisOptions = [];
    var nonMissingAxes = [];
    var missingAxes = [];

    for (j = 0; j < chartData.data.length; j++) {
        tempArray.push(chartData.data[j][0]);
        tempArray2.push(chartData.data[j][1]);
    };

    legendOptions = tempArray.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
    });

    axisOptions = tempArray2.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
    });
   
    axisOptions.sort();

    first:
    for (i = 0; i < legendOptions.length; i++) {
        second:
        for (p = 0; p < axisOptions.length; p++){
            third:
            for (k = 0; k < chartData.data.length; k++) {
                var tempHash = {};
                if(chartData.data[k][0].includes(legendOptions[i]) && chartData.data[k][1].includes(axisOptions[p])){
                    tempHash.axis = chartData.data[k][1];
                    tempHash.value = Math.log(chartData.data[k][2]);
                    sourceArray.push(tempHash);
                    nonMissingAxes.push(axisOptions[p]);
                    break third;
                };

            };
        };
        //console.log(nonMissingAxes);

        for(x = 0; x < axisOptions.length; x++){
            if(nonMissingAxes.indexOf(axisOptions[x])==-1){missingAxes.push(axisOptions[x]);}
        };
        
        //console.log(missingAxes);

        for(z = 0; z < missingAxes.length; z++){
            var tempHash = {};
            tempHash.axis = missingAxes[z];
            tempHash.value = 0;
            sourceArray.push(tempHash);
        };

        //sortObject(sourceArray);

        d.push(sourceArray);
        sourceArray = [];
        missingAxes = [];
        nonMissingAxes = [];
    };

    for(y = 0; y < d.length; y++){
        d[y].sort(function(a, b){
            if (a.axis < b.axis) {
                return -1;
            }
            if (a.axis > b.axis) {
                return 1;
            }
            return 0;
        });
    };
  
    // console.log(chartData.data);
    // console.log(d);
    // console.log(legendOptions);
    // console.log(axisOptions);

    //Data should be in this format. For Example:
    /*var d = [
    		  [
    			{axis:"Email",value:0.59},
    			{axis:"Social Networks",value:0.56},
    			{axis:"Internet Banking",value:0.42},
    			{axis:"News Sportsites",value:0.34},
    		  ],[
    			{axis:"Email",value:0.48},
    			{axis:"Social Networks",value:0.41},
    			{axis:"Internet Banking",value:0.27},
    			{axis:"News Sportsites",value:0.28},
    		  ]
    		]; */

    //Options for the Radar chart, other than default
    var mycfg = {
        w: w,
        h: h,
        //maxValue: 0.6,
        levels: 6,
        ExtraWidthX: 300
    }

    //Call function to draw the Radar chart
    //Will expect that data is in %'s
    RadarChart.draw("#chart", d, mycfg, axisOptions, chartData, legendOptions);

    ////////////////////////////////////////////
    /////////// Initiate legend ////////////////
    ////////////////////////////////////////////

    var svg = d3.select('#body')
        .selectAll('svg')
        .append('svg')
        .attr("width", w + 300)
        .attr("height", h);

    //Create the title for the legend
    var text = svg.append("text")
        .attr("class", "title")
        .attr('transform', 'translate(90,0)')
        .attr("x", w + 40)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("fill", "#404040")
        .text("Legend");

    //Initiate Legend	
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 100)
        .attr("width", 200)
        .attr('transform', 'translate(150,20)');

    //Create colour squares
    legend.selectAll('rect')
        .data(legendOptions)
        .enter()
        .append("rect")
        .attr("x", w)
        .attr("y", function(d, i) {
            return i * 20;
        })
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i) {
            return colorscale(i);
        });

    //Create text next to squares
    legend.selectAll('text')
        .data(legendOptions)
        .enter()
        .append("text")
        .attr("x", w + 20)
        .attr("y", function(d, i) {
            return i * 20 + 9;
        })
        .attr("font-size", "11px")
        .attr("fill", "#737373")
        .text(function(d) {
            return d;
        });

};

function sortObject(o) {
    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
};
