from audioop import cross
from flask import Flask, request, Response
from flask_cors import cross_origin
from read_db import get_bar_chart_data, get_monthly_pareto_data, get_line_chart_data, get_parts_table_data
from update_db import update_database

app = Flask(__name__)

@app.route('/')
def home():
    response_body = {
        "name": "Scott Andermann",
        "about": "It's working so far! need to set up env variables"
    }
    return response_body

@app.route('/fetch-data')
@cross_origin()
def fetch_data():
    # update_database()

    response_body = {
        "status": "update successful",
    }
    return response_body

@app.route('/bar-chart')
@cross_origin()
def bar_chart():
    response_body = get_bar_chart_data()
    return response_body

@app.route('/line-chart')
@cross_origin()
def line_chart():
    args = request.args
    offset = int(args.get('offset'))
    response_body = get_line_chart_data(offset)
    return response_body
    
@app.route('/pareto-chart')
@cross_origin()
def pareto_chart():
    response_body = get_monthly_pareto_data()
    return response_body

@app.route('/parts-table')
@cross_origin()
def parts_table():
    args = request.args
    offset = int(args.get('offset'))
    response_body = get_parts_table_data(offset)
    return response_body
