var room_type = "Private room";
var ctx;
var neighbourhood;

api_call('GET', '/home?room_type=' + room_type);
function api_call(method, endpoint) {
  var request = new XMLHttpRequest();

  request.open(method, endpoint, true);
  request.onload = function() {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400) {
      var json_response = JSON.parse(data.replace(/\\/g,''));
      append_home_fields(json_response);
      append_barchart_data(json_response);
  } else {
    console.log('error', request.status)
  }
  };
  request.send();
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

$( ".dropdown" ).change(function() {
  neighbourhood.destroy();
  var e = document.getElementById("dd");
  room_type = e.options[e.selectedIndex].value;
  api_call('GET', '/home?room_type=' + room_type);
});


