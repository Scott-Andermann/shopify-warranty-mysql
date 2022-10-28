from audioop import cross
from flask import Flask, request, Response
from flask_cors import cross_origin
from read_db import get_bar_chart_data, get_monthly_pareto_data, get_line_chart_data, get_parts_table_data, search_by_term, get_orders_by_zip, get_zip_loc, get_warr_by_zip
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
    args = request.args
    if len(args) == 0:
        select_orders_query = """SELECT sum(qty) AS sumClaims, count(qty) AS uniqueClaims 
        FROM orders 
        WHERE date BETWEEN %s AND %s AND INSTR(tags, 'warr') > 0
        ORDER BY sumClaims 
        DESC;
        """
        response_body = get_bar_chart_data(select_orders_query)
    else:
        skus = args.get('skus')
        skus = skus.replace(' ', '').split(',')
        select_orders_query = """SELECT sum(qty) AS sumClaims, count(qty) AS uniqueClaims 
        FROM orders 
        WHERE date BETWEEN %s AND %s AND INSTR(tags, 'warr') > 0
        AND sku = %s
        """
        response_body = {}
        for sku in skus:
            response = get_bar_chart_data(select_orders_query, sku)
            # print(sku)
            response_body[sku] = response
    # print(response_body)
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

@app.route('/search-term')
@cross_origin()
def serach_term():
    args = request.args
    term = args.get('term')
    response_body = search_by_term(term)
    return response_body

@app.route('/sales')
@cross_origin()
def sales():
    args = request.args
    skus = args.get('skus')
    skus = skus.replace(' ', '').split(',')
    query = """SELECT sum(qty) AS sum, count(qty) AS uniqueClaims 
        FROM orders 
        WHERE date BETWEEN %s AND %s
        AND sku = %s
        """
    response_body = {}
    for sku in skus:
        response = get_bar_chart_data(query, sku)
        # print(sku)
        response_body[sku] = response
    return response_body


@app.route('/heatmap')
@cross_origin()
def heatmap():
    args = request.args
    # print(args)
    skus = args.get('skus')
    warranty = args.get('warranty')
    skus = skus.replace(' ', '').split(',')
    query = """SELECT zip_code, sum(qty) AS sum
    FROM orders
    WHERE sku IN (%s) GROUP BY zip_code
    ORDER BY sum DESC
    """
    warr_query = """SELECT zip_code, sum(qty) AS sum
    FROM orders
    WHERE sku IN (%s) AND INSTR(tags, 'warr') > 0 GROUP BY zip_code
    ORDER BY sum DESC
    """

    response_body = {}

    # build query to include %s elements to match number of skus in query
    in_p = ', '.join(list(map(lambda x: '%s', skus)))
    query = query % in_p
    warr_query = warr_query % in_p

    orders = get_orders_by_zip(query, skus)
    loc_list, max_count = get_zip_loc(orders)
    response_body = get_warr_by_zip(warr_query, loc_list, max_count, skus)

    return response_body
