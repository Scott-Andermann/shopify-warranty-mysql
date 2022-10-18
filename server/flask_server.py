from flask import Flask, request, Response

app = Flask(__name__)

@app.route('/')
def home():
    response_body = {
        "name": "Scott Andermann",
        "about": "It's working so far! need to set up env variables"
    }
    return response_body

@app.route('/bar-chart')
def bar_chart():
    response_body = {
        'name': 'data goes here'
    }
    return response_body