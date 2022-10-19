from audioop import cross
from flask import Flask, request, Response
from read_db import get_bar_chart_data, get_monthly_pareto_data, get_line_chart_data
from flask_cors import cross_origin

app = Flask(__name__)

@app.route('/')
def home():
    response_body = {
        "name": "Scott Andermann",
        "about": "It's working so far! need to set up env variables"
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
    response_body = get_line_chart_data()
    return response_body
    
@app.route('/pareto-chart')
@cross_origin()
def pareto_chart():
    response_body = get_monthly_pareto_data()
    return response_body