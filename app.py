import flask_restful
from flask import Flask, render_template
from flask_pymongo import PyMongo
from flask_restful import reqparse, abort, Api, Resource

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
        return {}


##
## Actually setup the Api resource routing here
##
api.add_resource(Dataset, '/dataset')

if __name__ == '__main__':
    app.run()
