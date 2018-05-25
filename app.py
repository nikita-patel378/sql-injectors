from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo
import pandas as pd

app = Flask(__name__)

mongo = PyMongo(app)


@app.route("/")
def home():
    return render_template("bubble.html")


@app.route("/particles")
def particles():

    particles = pd.read_json("particles.json")

    print(type(particles))

    return jsonify(particles.to_dict(orient="records"))


@app.route("/data")
def data():

    df = pd.read_csv("data/raw_data/honeyproduction.csv", encoding='utf-8')

    return jsonify(df.to_dict(orient="records"))


@app.route("/map-data")
def map_data():

    df = pd.read_csv("data/raw_data/honeyproduction_withlatlon.csv", encoding='utf-8')
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


if __name__ == "__main__":
    app.run(debug=True)
