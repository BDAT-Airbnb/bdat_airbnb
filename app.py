from flask import Flask, render_template

app = Flask(__name__)


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


if __name__ == '__main__':
    app.run()
