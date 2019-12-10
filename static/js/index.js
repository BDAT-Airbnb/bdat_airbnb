var room_type = "Private room";
var ctx;
var neighbourhood;
var pie_loaded = false;


api_call('GET', '/home?room_type=' + room_type);
api_call('GET', '/word-cloud');
api_call('GET', '/area_chart');

function api_call(method, endpoint) {
  var request = new XMLHttpRequest();

  request.open(method, endpoint, true);
  request.onload = function() {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400) {
      var json_response = JSON.parse(data.replace(/\\/g,''));
      if (endpoint === "/word-cloud") {
        append_word_cloud(json_response);
      } else if (endpoint === "/area_chart") {
        append_area_chart(json_response)
      } else {
        append_home_fields(json_response);
        append_barchart_data(json_response);
        if (!pie_loaded) {
          append_pie_chart(json_response["pie_chart_data"]);
        }
      }
  } else {
    console.log('error', request.status)
  }
  };
  request.send();
}

function append_word_cloud(json_response) {
  var chart = anychart.tagCloud(json_response);
  // chart.title('15 most spoken languages');
  // set an array of angles at which the words will be laid out
  chart.angles([0]);
  // enable a color range
  chart.colorRange(true);
  // set the color range length
  chart.colorRange().length('80%');

  // display the word cloud chart
  chart.container("word-cloud");
  chart.draw();
}

function append_home_fields(json_data) {
  document.getElementById("total_records").innerHTML = json_data['total_records'];
  document.getElementById("total_hosts").innerHTML = json_data['total_hosts'];
  document.getElementById("price_range").innerHTML = json_data['price_range'];
}


function append_barchart_data(json_data) {
  var room_types = json_data['room_types'];
  var dropdown = document.getElementById("dd");
  dropdown.innerHTML = '';
  for(var i = 0; i < room_types.length; i++) {
       var opt = document.createElement("option");
       opt.value= room_types[i];
       if(room_type === room_types[i]) {
         opt.selected = "selected";
       }
       opt.innerHTML = room_types[i]; // whatever property it has
       dropdown.appendChild(opt);
  }

    // Bar Chart Example

ctx = document.getElementById("neighbourhood");
data_points = json_data['data'];

neighbourhood = new Chart(ctx, {

  type: 'bar',
  data: {
    labels: json_data['label'],
    datasets: [{
      label: "Count",
      backgroundColor: "#4e73df",
      hoverBackgroundColor: "#2e59d9",
      borderColor: "#4e73df",
      data: data_points,
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'count'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 6,
          autoSkip: false
        },
        maxBarThickness: 25,
      }],
      yAxes: [{
        ticks: {
          min: 0,
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return  number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ':' + number_format(tooltipItem.yLabel);
        }
      }
    },
  }
});
}
function append_pie_chart(pie_chart_data) {
  // Pie Chart Example
var ctx = document.getElementById("myPieChart");
var chart_options = document.getElementById("pie_chart");
chart_options.innerHTML = '';
var pie_labels = pie_chart_data["labels"];
  for(var i = 0; i < pie_labels.length; i++) {
       var span = document.createElement("span");
       span.className = "mr-2";
       var opt = document.createElement("i");
       if (i === 0) {
         opt.className = "fas fa-circle pie-1";
       } else if (i === 1) {
         opt.className = "fas fa-circle pie-2";
       } else {
         opt.className = "fas fa-circle pie-3";
       }
       opt.value = pie_labels[i];
       opt.innerHTML = pie_labels[i]; // whatever property it has
    span.appendChild(opt);
       chart_options.appendChild(span);
  }

var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: pie_labels,
    datasets: [{
      labels: pie_labels,
      data: pie_chart_data["data"],
      backgroundColor: ['#1cc88a', '#4e73df', '#36b9cc'],
      hoverBackgroundColor: ['#1cc88a', '#4e73df', '#36b9cc'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,

    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});
pie_loaded = true;
}

function append_area_chart(json_data) {
  // Area Chart Example
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: json_data["labels"],
    datasets: [{
      label: "Count",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(78, 115, 223, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 1)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: json_data["data"],
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
        }
      }
    }
  }
});
}

$( ".dropdown" ).change(function() {
  neighbourhood.destroy();
  var e = document.getElementById("dd");
  room_type = e.options[e.selectedIndex].value;
  api_call('GET', '/home?room_type=' + room_type);
});


