import json

from bson import json_util
from flask import Flask, render_template, request
from flask_pymongo import PyMongo
from flask_restful import Api, Resource
from pymongo import DESCENDING, ASCENDING

from utils.encoder import JSONEncoder

app = Flask(__name__)
api = Api(app)

app.config['MONGO_DBNAME'] = 'bdat_airbnb'
app.config["MONGO_URI"] = "mongodb://localhost:27017/bdat_airbnb"
# app.config['MONGO_URI'] = 'mongodb://user:pass@host.domain.com:12345/mongodb_database'

mongo = PyMongo(app)


@app.errorhandler(401)
def FUN_401(error):
    return render_template("page_401.html"), 401


@app.errorhandler(403)
def FUN_403(error):
    return render_template("page_403.html"), 403


@app.errorhandler(404)
def FUN_404(error):
    return render_template("page_404.html"), 404


@app.errorhandler(405)
def FUN_405(error):
    return render_template("page_405.html"), 405


@app.route('/')
def airbnb_route():
    return render_template("index.html")


@app.route('/index.html')
def airbnb_dashboard():
    return render_template("index.html")


@app.route('/charts.html')
def airbnb_charts():
    return render_template("charts.html")


@app.route('/tables.html')
def airbnb_tables():
    return render_template("tables.html")


class Dataset(Resource):
    def get(self):
        pageNum = int(request.args.get('pageNum'))
        limit = int(request.args.get('limit'))
        searchKeyword = request.args.get('searchKeyword')
        if searchKeyword is None:
            searchQuery = {}
        else:
            searchQuery = {"name": searchKeyword}

        metrics = list(mongo.db.metrics.find().sort('name').skip((pageNum - 1) * limit).limit(limit))
        totalRows = mongo.db.metrics.count()
        response = {'totalRows': totalRows, 'numberOfRecords': len(metrics), 'metrics': metrics, 'limit': limit}
        return json.dumps(response, default=json_util.default)


def bar_chart(room_type):
    neighbourhood = list(mongo.db.metrics.aggregate([{"$match": {"room_type": room_type}}
                                                        , {"$group": {"_id": "$neighbourhood", "count": {"$sum": 1}}}
                                                        , {"$sort": {"count": -1}}, {"$limit": 10}]))
    label = []
    data = []
    for item in neighbourhood:
        label.append(item.get('_id'))
        data.append(item.get('count'))
    room_types = list(mongo.db.metrics.aggregate([{"$group": {"_id": "$room_type"}}]))
    room_types_list = []
    for room_type in room_types:
        room_types_list.append(room_type["_id"])
    response = {"label": label, "data": data, "room_types": room_types_list}
    return response


def get_pie_chart_data(total_records):
    room_types = list(mongo.db.metrics.aggregate([{"$group": {"_id": "$room_type", "count": {"$sum": 1}}},
                                                  {"$project": {
                                                      "percentage": {"$multiply": [{"$divide": [100, total_records]},
                                                                                   "$count"]}}}]))
    labels = []
    data = []
    response = {}
    for room_type in room_types:
        labels.append(room_type["_id"])
        data.append(round(room_type["percentage"]))

        response.update({"labels": labels, "data": data})
    return response


class HomePage(Resource):
    def get(self):
        total_records = mongo.db.metrics.count()
        total_hosts = mongo.db.metrics.distinct("host_id").__len__()
        min_price_cur = mongo.db.metrics.find().sort("price", ASCENDING).limit(1)
        max_price_cur = mongo.db.metrics.find().sort("price", DESCENDING).limit(1)
        min_price = ''
        max_price = ''
        for i, min_price_doc in enumerate(min_price_cur):
            min_price = str(min_price_doc["price"])
        for i, max_price_doc in enumerate(max_price_cur):
            max_price = str(max_price_doc["price"])

        response = {"total_records": total_records, "total_hosts": total_hosts
            , "price_range": min_price + " - " + max_price}
        response.update(bar_chart(request.args.get('room_type')))
        pie_chart_data = get_pie_chart_data(total_records)
        response.update({"pie_chart_data": pie_chart_data})
        print(response)
        return json.dumps(response, default=json_util.default)


class WordCloud(Resource):
    def get(self):
        word_cloud = list(mongo.db.metrics.aggregate([{"$group": {"_id": "$neighbourhood", "value": {"$sum": 1}
            , "category": {"$first": "$neighbourhood_group"}}}, {"$project": {"x": "$_id"
            , "value": "$value", "category": "$category", "_id": False}}]))
        return json.dumps(word_cloud, default=json_util.default)


class AreaChart(Resource):
    def get(self):
        price_ranges = list(mongo.db.metrics.aggregate([{
            "$project": {
                "range": {
                    "$concat": [
                        {"$cond": [{"$lte": ["$price", 0]}, "Free Rentals", ""]},
                        {"$cond": [{"$and": [{"$gt": ["$price", 0]}, {"$lt": ["$price", 200]}]}, "Under 200", ""]},
                        {"$cond": [{"$and": [{"$gte": ["$price", 200]}, {"$lt": ["$price", 400]}]}, "200 - 400", ""]},
                        {"$cond": [{"$and": [{"$gte": ["$price", 400]}, {"$lt": ["$price", 600]}]}, "400 - 600", ""]},
                        {"$cond": [{"$and": [{"$gte": ["$price", 600]}, {"$lt": ["$price", 800]}]}, "600 - 800", ""]},
                        {"$cond": [{"$and": [{"$gte": ["$price", 800]}, {"$lt": ["$price", 1000]}]}, "800 - 1000", ""]},
                        {"$cond": [{"$gte": ["$price", 1000]}, "Over 1000", ""]}
                    ]
                }
            }
        }, {"$group": {"_id": "$range", "count": {"$sum": 1}}}]))

        price_labels = [0] * 7
        price_range_count = [0] * 7
        for price_range in price_ranges:
            label = price_range["_id"]
            if label == "Free Rentals":
                price_labels[0] = label
                price_range_count[0] = price_range["count"]
            elif(label == "Under 200"):
                price_labels[1] = label
                price_range_count[1] = price_range["count"]
            elif (label == "200 - 400"):
                price_labels[2] = label
                price_range_count[2] = price_range["count"]
            elif (label == "400 - 600"):
                price_labels[3] = label
                price_range_count[3] = price_range["count"]
            elif (label == "600 - 800"):
                price_labels[4] = label
                price_range_count[4] = price_range["count"]
            elif (label == "800 - 1000"):
                price_labels[5] = label
                price_range_count[5] = price_range["count"]
            elif (label == "Over 1000"):
                price_labels[6] = label
                price_range_count[6] = price_range["count"]
        response = {"labels": price_labels, "data": price_range_count}
        print(response)
        return json.dumps(response, default=json_util.default)


##
## Actually setup the Api resource routing here
##
api.add_resource(Dataset, '/dataset')
api.add_resource(HomePage, "/home")
api.add_resource(WordCloud, "/word-cloud")

api.add_resource(AreaChart, "/area_chart")

if __name__ == '__main__':
    app.run(port=8002)
    app.run()
