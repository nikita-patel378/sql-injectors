import datetime as dt
import numpy as np
import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
from flask_sqlalchemy import SQLAlchemy
# The database URI
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data/raw_data/honeyproduction.sqlite"

db = SQLAlchemy(app)


class HoneyProd(db.Model):
    __tablename__ = 'honeyproduction'
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.String)
    numcol = db.Column(db.String)
    yieldpercol = db.Column(db.String)
    totalprod = db.Column(db.String)
    stocks = db.Column(db.String)
    priceperlb = db.Column(db.String)
    prodvalue = db.Column(db.String)
    year = db.Column(db.String)

    def __repr__(self):
        return '<HoneyProd %r>' % (self.name)


# now for the leaflet map
from flask_sqlalchemy import SQLAlchemy
# The database URI
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data/raw_data/honeyproduction_withlatlon.sqlite"

db = SQLAlchemy(app)


class HoneyProdCoord(db.Model):
    __tablename__ = 'honeyproduction_withlatlon'
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.String)
    numcol = db.Column(db.String)
    yieldpercol = db.Column(db.String)
    totalprod = db.Column(db.String)
    stocks = db.Column(db.String)
    priceperlb = db.Column(db.String)
    prodvalue = db.Column(db.String)
    year = db.Column(db.String)
    latitude = db.Column(db.String)
    longitude = db.Column(db.String)
    state_yr = db.Column(db.String)

    def __repr__(self):
        return '<HoneyProdCoord %r>' % (self.name)


# Create database tables
@app.before_first_request
def setup():
    # Recreate database each time for demo
    # db.drop_all()
    db.create_all()

##########################################################
 ##############The Routes#################################


@app.route("/")
def main():
    return render_template("index.html")


@app.route("/index")
def home():
    return render_template("index.html")


@app.route("/bubble")
def bubble():
    return render_template("bubble.html")


@app.route("/map")
def map():
    return render_template("map.html")


@app.route("/colony")
def colony():
    return render_template("colony.html")


@app.route("/particles")
def particles():

    particles = pd.read_json("particles.json")

    print(type(particles))

    return jsonify(particles.to_dict(orient="records"))


@app.route("/data")
def data():

    df = pd.read_sql_table("honeyproduction", "sqlite:///data/raw_data/honeyproduction.sqlite")

    return jsonify(df.to_dict(orient="records"))


@app.route("/map-data")
def map_data():

    df = pd.read_sql_table("honeyproduction_withlatlon",
                           "sqlite:///data/raw_data/honeyproduction_withlatlon.sqlite")
    data = []
    for i, row in df.iterrows():
        data.append({
            'state': row["state"],
            'totalprod': row["totalprod"],
            'year': row["year"],
            'latitude': row["latitude"],
            'longitude': row["longitude"],
            'state_yr': row["state_yr"]
        })

    return jsonify(data)


@app.route("/honey-pest")
def honey_pest():

    df = pd.read_csv("data/clean_data/honey_pest_1991_2017.csv", encoding='utf-8')

    return jsonify(df.to_dict(orient="records"))


@app.route("/honey-temp-pest")
def honey_temp():

    df = pd.read_csv("data/clean_data/honey_temp_pest_1991_2013.csv", encoding='utf-8')

    return jsonify(df.to_dict(orient="records"))


if __name__ == "__main__":
    app.run(debug=True)
