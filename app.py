import pandas as pd
import geojson

from flask import (
    Flask,
    render_template,
    jsonify)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
from flask_sqlalchemy import SQLAlchemy
# The database URI
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data/clean_data/honeyproduction.sqlite"

db = SQLAlchemy(app)


class HoneyProd(db.Model):
    __tablename__ = 'honey_pest_1991_2017'
    id = db.Column(db.Integer, primary_key = True)
    state = db.Column(db.String)
    year = db.Column(db.Integer)
    state_name = db.Column(db.String)
    numcol = db.Column(db.Integer)
    yieldpercol = db.Column(db.Numeric)
    totalprod = db.Column(db.Numeric)
    stocks = db.Column(db.Numeric)
    priceperlb = db.Column(db.Numeric)
    prodvalue = db.Column(db.Numeric)
    totalpest = db.Column(db.Numeric)

    __tablename__ = 'honeyproduction_withlatlon'
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.String)
    state_full=db.Column(db.String)
    numcol = db.Column(db.Integer)
    yieldpercol = db.Column(db.Numeric)
    totalprod = db.Column(db.Numeric)
    stocks = db.Column(db.Numeric)
    priceperlb = db.Column(db.Numeric)
    prodvalue = db.Column(db.Numeric)
    year = db.Column(db.Integer)
    latitude = db.Column(db.Numeric)
    longitude = db.Column(db.Numeric)
    state_yr = db.Column(db.String)
    temp_min = db.Column(db.Numeric)
    temp_max = db.Column(db.Numeric)
    temp_minC = db.Column(db.Numeric)
    temp_maxC = db.Column(db.Numeric)

    


    def __repr__(self):
        return '<HoneyProd %r>' % (self.name)




# Create database tables
@app.before_first_request
def setup():
    # Recreate database each time for demo
  #  db.drop_all()
    db.create_all()

##########################################################
 #                   The Routes
##########################################################

@app.route("/")
def main():
    return render_template("index.html")


@app.route("/index")
def home():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/colony")
def colony():
    return render_template("colony.html")

@app.route("/particles")
def particles():

    particles = pd.read_json("particles.json")

    print(type(particles))

    return jsonify(particles.to_dict(orient="records"))


@app.route("/bubble")
def bubble():
    return render_template("bubble.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/honey-pest")
def honey_pest():

    df = pd.read_sql_table("honey_pest_1991_2017", "sqlite:///data/clean_data/honeyproduction.sqlite")

    return jsonify(df.to_dict(orient="records"))

@app.route("/map-data")
def map_data():

    df = pd.read_sql_table("honeyproduction_withlatlon", "sqlite:///data/clean_data/honeyproduction.sqlite")
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


@app.route("/temp-data2")
def temp_data2():
    path_to_file = 'static/json/us-states.json'
    temp_df = pd.read_sql_table("honeyproduction_withlatlon", "sqlite:///data/clean_data/honeyproduction.sqlite")

    with open(path_to_file) as f:
        json_data = geojson.load(f)

    for i in range(len(json_data['features'])):
        # Create empty list to add the array of temp_max for years 1998-2012
        json_data['features'][i]['properties']['temperatures'] = []

        for j in range(len(temp_df['state_full'])):
            # if condition for state is matched, insert max temperature
            if json_data['features'][i]['properties']['name'] == temp_df["state_full"][j]:
                #json_data['features'][i]['properties']['temperatures'] = []
                json_data['features'][i]['properties']['temperatures'].append(
                    {'year': str(temp_df["year"][j]), 'temp_max': (temp_df["temp_max"][j])})
                # json_data['features'][i]['properties']['temperatures'].append((temp_df["temp_max"][j]))
                # json_data['features'][i]['properties']['temperatures']['year'] = str(temp_df["year"][j])
                # json_data['features'][i]['properties']['temp_max'] = str(temp_df["temp_max"][j])
                # break

    return jsonify(json_data)





if __name__ == "__main__":
    app.run(debug=True)
