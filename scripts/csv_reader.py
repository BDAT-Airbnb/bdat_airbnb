import csv
import json

import pandas as pd
from pymongo import MongoClient

# DB connectivity
client = MongoClient('localhost', 27017)
db = client.bdat_airbnb
db.metrics.drop()

#CSV to JSON Conversion
#file_path = '/home/abin/Georgian_BigData_Sem1/Dataprogramming-TUE-1/projects/new-york-city-airbnb-open-data/AB_NYC_2019.csv'
file_path = '/home/ubuntu/AB_NYC_2019.csv'
df = pd.read_csv(file_path,encoding = 'ISO-8859-1')
records = json.loads(df.T.to_json()).values()
db.metrics.insert(records)

# csvFile = open('/home/abin/Georgian_BigData_Sem1/Dataprogramming-TUE-1/projects/new-york-city-airbnb-open-data/AB_NYC_2019.csv', 'r')
# reader = csv.DictReader(csvFile)
#
# header = ["id", "name", "host_id", "host_name", "neighbourhood_group", "neighbourhood", "latitude", "longitude"
#     , "room_type", "price", "minimum_nights", "number_of_reviews", "last_review", "reviews_per_month"
#     , "calculated_host_listings_count", "availability_365"]
#
# for each in reader:
#     row = {}
#     for field in header:
#         print(each[field])
#
#         row[field] = float(each[field])
#
#     db.metrics.insert(row)
