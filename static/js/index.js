var room_type = "Private room";
//document.getElementById("dropdownMenuButton").innerHTML = room_type;
var ctx;

api_call();
function api_call() {
  var request = new XMLHttpRequest();

  request.open('GET', '/barchart?room_type=' + room_type, true);
  request.onload = function() {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400) {
      var json_response = JSON.parse(data.replace(/\\/g,''));
      append_barchart_data(json_response);
  } else {
    console.log('error', request.status)
  }
  };

  request.send();
}

var neighbourhood;
function append_barchart_data(json_data) {
  var room_types = json_data['room_types'];
  var menu_items = "";
  index=0;
  var dropdown = document.getElementById("dd");
  dropdown.innerHTML = '';
  for(var i = 0; i < room_types.length; i++) {
    //menu_items+= '<a class="dropdown-item" href="#">' + room_types[i] +'</a>'
       var opt = document.createElement("option");
       opt.value= room_types[i];
       opt.innerHTML = room_types[i]; // whatever property it has
        dropdown.appendChild(opt);
       index++;
  }
  //document.getElementById("dropdown").innerHTML = menu_items;

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

//$(function(){
//  $(".dropdown-menu li a").click(function(){
    //room_type = $(this).text();
//    $(".btn:first-child").text($(this).text());
//    $(".btn:first-child").val($(this).text());
    //api_call();
//  });
//});

// function dropdown_select() {
//   console.log("Hey I got you!!!")
// }
//
// $("dropdown-list").on("click", function() {
//     //allOptions.removeClass('selected');
//     //$(this).addClass('selected');
//     //$("ul").children('.init').html($(this).html());
//     //allOptions.toggle();
//   console.log("Hey I got you!!!")
// });
//
//   $('.dropdown-menu a').click(function(){
//     $('#selected').text($(this).text());
//   });

  $(function(){

    $(".dropdown-menu a").click(function(){
      var selected = $(this).text();
      $(".btn:first-child").text(selected);
      $(".btn:first-child").val(selected);
      room_type = selected;
      api_call();
   });

});

$( ".dropdown" ).change(function() {
  neighbourhood.destroy();
  var e = document.getElementById("dd");
  var selected = e.options[e.selectedIndex].value;
  console.log(selected);
  room_type = selected;
  api_call();
	// chart.options.data[0].dataPoints = [];
  // var e = document.getElementById("dd");
	// var selected = e.options[e.selectedIndex].value;
  // dps = jsonData[selected];
  // for(var i in dps) {
  //   chart.options.data[0].dataPoints.push({label: dps[i].label, y: dps[i].y});
  // }
  // chart.render();
});


