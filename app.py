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


@app.route("/bubble-data")
def bubble_data():

    # Read csv as df
    honey_df = pd.read_csv("data/raw_data/honeyproduction.csv", encoding='utf-8')

    # Sort by state then by year
    honey_df = honey_df.sort_values(by=["state", "year"]).reset_index(drop=True)

    # Initialize list of dictionaries
    data = []

    # Get list of unique states
    states_list = honey_df["state"].unique()

    for state in states_list:

        init_dict = {}

        init_dict["state"] = state

        numcol = []
        yieldpercol = []
        totalprod = []
        stocks = []
        priceperlb = []
        prodvalue = []

        for i, row in honey_df.iterrows():

            if state == row["state"]:

                numcol.append([row["year"], row["numcol"]])
                yieldpercol.append([row["year"], row["yieldpercol"]])
                totalprod.append([row["year"], row["totalprod"]])
                stocks.append([row["year"], row["stocks"]])
                priceperlb.append([row["year"], row["priceperlb"]])
                prodvalue.append([row["year"], row["prodvalue"]])

        init_dict["numcol"] = numcol
        init_dict["yieldpercol"] = yieldpercol
        init_dict["totalprod"] = totalprod
        init_dict["stocks"] = stocks
        init_dict["priceperlb"] = priceperlb
        init_dict["prodvalue"] = prodvalue

        data.append(init_dict)

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
