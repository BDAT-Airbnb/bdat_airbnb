import json

from bson import json_util
from flask import Flask, render_template, request
from flask_pymongo import PyMongo
from flask_restful import Api, Resource

from utils.encoder import JSONEncoder

app = Flask(__name__)
api = Api(app)

app.config['MONGO_DBNAME'] = 'bdat_airbnb'
app.config["MONGO_URI"] = "mongodb://localhost:27017/bdat_airbnb"
#app.config['MONGO_URI'] = 'mongodb://user:pass@host.domain.com:12345/mongodb_database'

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


##
## Actually setup the Api resource routing here
##
api.add_resource(Dataset, '/dataset')

if __name__ == '__main__':
    app.run()
