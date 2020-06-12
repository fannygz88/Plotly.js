//Loading the data
var url = '../../samples.json'
const dataJson = d3.json(url);

//Variables to select the elemente that are going to be used
var dropDown = d3.select("#selDataset");
dropDown.on("change",optionChanged);
var selectorPanel = d3.select(".panel-body"); 

// extracting the names of the dropdown values that will be used in the selection
dataJson.then((report) =>{
    var names = report.names;   
    selData(names);       
   
          
});
// function to add the options for the dropdown
function selData(names){
    var selector = d3.select("#selDataset");
    var option;
    
    names.forEach((name)=>{
        option=selector.append("option").text(name).attr("value",name);       

    });
}

// function that handle the event
function optionChanged(){
    selectorPanel.html("");        
    var elDrop = parseInt(dropDown.property("value"));
    dataJson.then((report) =>{
        var samples = report.samples;
        var metaData = report.metadata;
        // Demographic info
        metaData.forEach((md)=>{
           //filtering the data based on the election from the dropdown
            var mId = md.id;
            if (mId == elDrop){
                Object.entries(md).forEach(([key,value])=>{    
                    var option;
                    option = selectorPanel.append("p").text(` ${key}: ${value}`);               
                                                           
                })    
                var freq=md.wfreq;
                console.log(freq);  
                plotGauge(freq);                   
                
            }
            
        })
        
        //the sample data
        samples.forEach((sample)=>{
            
       
        var idSample = sample.id;
                //filtering the data based on the election from the dropdown   
            if (idSample==elDrop){
                 //Slicing the data just for the first ten elements
                var otu_ids = sample.otu_ids.slice(0,10);               
                var otu_labels = sample.otu_labels.slice(0,10);                               
                var sample_values = sample.sample_values.slice(0,10);
                //converting into a list the results to pass it to the functions that plots
                var li=[];
                for(var i =0;i<otu_ids.length;i++){
                    var ob={"id":otu_ids[i],"labels":otu_labels[i],"value":sample_values[i]};
                    li.push(ob);

                }
                //ordering the list
                var liSort= li.sort((a,b)=> a.value-b.value);
                //passing the list to the functions that plot:
                //Bar and Bubble charts
                plotBar (liSort);
                plotBubble(liSort);
               
    
            }
                       
        })   
        
    });

}


//plotting the bar chart
function plotBar (liSort){
    
    var y =liSort.map((d)=>"OTU "+ String(d.id));
    //creating the trace
    var trace = {
        x:liSort.map((d)=> d.value),
        y:y,
        type:"bar",
        orientation: 'h',
        text:liSort.map((d)=> d.labels),
                            
        marker: {
            color: '#e3b43d',
            line: {
              color: '#e3b43d',
              width: 2
            }
          },       
        
    };
    //creating the layout
    var layout = {                   
        width: 400,
        height: 600,
        paper_bgcolor: 'rgb(248,248,255)',
        plot_bgcolor: 'rgb(248,248,255)',
        legend: {
            x: 0.029,
            y: 1.238,
            font: {
              size: 10
            }
          },
        margin: {
            l: 100,
            r: 20,
            t: 20,
            b: 50
          }
    };
    Plotly.newPlot("bar", [trace],layout);
}

//function that creates the bubble chart

function plotBubble(liSort){
    
    var trace1 = {
        x: liSort.map((d)=>d.id),
        y: liSort.map((d)=>d.value),
        text: liSort.map((d)=> d.labels),
        mode: 'markers',
        marker: {
          color:liSort.map((d)=>d.id) ,
          size: liSort.map((d)=>d.value)
        }
    }
    var layout = {
        
        showlegend: false,
        height: 700,
        width: 1200,
        xaxis:{title:"OTU ID"}
        };
      
    Plotly.newPlot("bubble",[trace1],layout);
}

function plotGauge(freq){
    var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: freq,
          title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
          gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "#d19721" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "#c8e3c8" },
              { range: [1, 2], color: "#aed1ae" },
              { range: [2,3], color: "#93bd93" },
              { range: [3,4], color: "#88b388" },
              { range: [4,5], color: "#7eab7e" },
              { range: [5,6], color: "#729e72" },
              { range: [6,7], color: "#699469" },
              { range: [7,8], color: "#598559" },
              { range: [8,9], color: "#487048" },
              
            ]
            
          }
        }
      ];
      
      var layout = {
        width: 450,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "rgb(248,248,255)",
        font: { color: "#595957", family: "Arial" }
      };
      
      Plotly.newPlot('gauge', data, layout);
}