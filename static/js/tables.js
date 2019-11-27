// Basic example
var search_keyword = "";
var limit = 10;
var pageNum = 1;
var request;
$(document).ready(function () {
  $('#dataTable').DataTable({
    "pagingType": "full_numbers" // "simple" option for 'Previous' and 'Next' buttons only
  });
  $('.dataTables_length').addClass('bs-select');

});


  request = new XMLHttpRequest();

  request.open('GET', '/dataset?searchKeyword=' + search_keyword + '&pageNum=' + pageNum + '&limit=' + limit, true);
  request.onload = function() {
  // Begin accessing JSON data here
  var data = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400) {
      pageNum ++;
      var json_response = JSON.parse(data.replace(/\\/g,''));
      const total_rows = json_response['totalRows'];
      const number_of_records = json_response['numberOfRecords'];
      append_table_info(total_rows, number_of_records);
      append_metrics('dataTable', json_response['metrics'])
  } else {
    console.log('error', request.status)
  }
  };

request.send();


function append_table_info(total_rows, number_of_records) {
    const from_index = (pageNum * limit) - (limit - 1);
    const to_index = from_index + (limit - 1);
    document.getElementById('dataTable_info').innerHTML = "Showing " + from_index + " to " + to_index + " of " + total_rows+ "entries";
}

//this function appends the json data to the table based on tableId
function append_metrics(tableId, data){

    var table = document.getElementById(tableId);
    data.forEach(function(object) {
        var tbody = document.createElement('tbody');
        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + object.id + '</td>' +
            '<td>' + object.name + '</td>' +
            '<td>' + object.host_id + '</td>' +
            '<td>' + object.host_name + '</td>'+
            '<td>' + object.neighbourhood_group + '</td>'+
            '<td>' + object.neighbourhood + '</td>'+
            '<td>' + object.latitude + '</td>'+
            '<td>' + object.longitude + '</td>'+
            '<td>' + object.room_type + '</td>'+
            '<td>' + object.price + '</td>'+
            '<td>' + object.minimum_nights + '</td>'+
            '<td>' + object.number_of_reviews + '</td>'+
            '<td>' + object.last_review + '</td>'+
            '<td>' + object.reviews_per_month + '</td>'+
            '<td>' + object.calculated_host_listings_count + '</td>'+
            '<td>' + object.availability_365 + '</td>';
        tbody.appendChild(tr);
        table.appendChild(tbody);
    });
}