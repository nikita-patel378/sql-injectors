from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo
import pandas as pd
import geojson
import json

app = Flask(__name__)

mongo = PyMongo(app)


@app.route("/")
def home():
    return render_template("map.html")


@app.route("/particles")
def particles():

    particles = pd.read_json("particles.json")

    print(type(particles))

    return jsonify(particles.to_dict(orient="records"))


@app.route("/data")
def data():

    df = pd.read_csv("data/raw-data/honeyproduction.csv", encoding='utf-8')

    return jsonify(df.to_dict(orient="records"))


@app.route("/map-data")
def map_data():

    df = pd.read_csv("data/raw_data/honeyproduction_withlatlon.csv", encoding='utf-8')
    data = []
    for i, row in df.iterrows():
        data.append({
            'state': row["state"], 
            'state_full': row["state_full"],             
            'totalprod': row["totalprod"],
            'year': row["year"],
            'latitude': row["latitude"],
            'longitude': row["longitude"],
            'state_yr': row["state_yr"],
            'temp_max': row["temp_max"],
            'temp_min': row["temp_min"]
        })

    return jsonify(data)

@app.route("/temp-data1")
def temp_data1():
    path_to_file = 'data/raw_data/us-states.json'
    temp_df = pd.read_csv("data/raw_data/honeyproduction_withlatlon.csv")

    with open(path_to_file) as f:
        json_data = geojson.load(f)
    
    for i in range(len(json_data['features'])):
        # if condition for state is matched, insert max temperature
        for j in range(len(temp_df['state_full'])):
            if json_data['features'][i]['properties']['name'] == temp_df["state_full"][j]:
                 json_data['features'][i]['properties']['temp_max_{}'.format(temp_df["year"][j])] = temp_df["temp_max"][j].round(2)

    return jsonify(json_data)



@app.route("/temp-data2")
def temp_data2():
    path_to_file = 'data/raw_data/us-states.json'
    temp_df = pd.read_csv("data/raw_data/honeyproduction_withlatlon.csv")

    with open(path_to_file) as f:
        json_data = geojson.load(f)


    for i in range(len(json_data['features'])):
        # Create empty list to add the array of temp_max for years 1998-2012
        json_data['features'][i]['properties']['temperatures'] = []

        for j in range(len(temp_df['state_full'])):
            #if condition for state is matched, insert max temperature
            if json_data['features'][i]['properties']['name'] == temp_df["state_full"][j]:
                #json_data['features'][i]['properties']['temperatures'] = []
                json_data['features'][i]['properties']['temperatures'].append({'year': str(temp_df["year"][j]), 'temp_max': (temp_df["temp_max"][j])})
                #json_data['features'][i]['properties']['temperatures'].append((temp_df["temp_max"][j]))         
                # json_data['features'][i]['properties']['temperatures']['year'] = str(temp_df["year"][j])
                # json_data['features'][i]['properties']['temp_max'] = str(temp_df["temp_max"][j])
                #break

    return jsonify(json_data)



if __name__ == "__main__":
    app.run(debug=True)
