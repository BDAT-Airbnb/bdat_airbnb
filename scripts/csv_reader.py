import csv
from pymongo import MongoClient
#CSV to JSON Conversion
csvFile = open('/home/abin/Georgian_BigData_Sem1/Dataprogramming-TUE-1/projects/new-york-city-airbnb-open-data/AB_NYC_2019.csv', 'r')
reader = csv.DictReader(csvFile)
# DB connectivity
client = MongoClient('localhost', 27017)
db = client.bdat_airbnb
db.metrics.drop()
header = ["id", "name", "host_id", "host_name", "neighbourhood_group", "neighbourhood", "latitude", "longitude"
    , "room_type", "price", "minimum_nights", "number_of_reviews", "last_review", "reviews_per_month"
    , "calculated_host_listings_count", "availability_365"]

for each in reader:
    row = {}
    for field in header:
        row[field] = each[field]

    db.metrics.insert(row)
