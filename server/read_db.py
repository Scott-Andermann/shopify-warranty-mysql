from mysql.connector import connect, Error
from datetime import datetime, date, timedelta


def get_bar_chart_data():
    # gather data from database, put into list and return 3 datasets, current year, Previous year, dates
    year = date.today().year
    replace_month = date.today().month
    end_date = date.today().replace(day=1)
    start_date = end_date.replace(month=replace_month)
    dates = [start_date.month]
    try:
        with connect(
            host='localhost',
            user='root',
            password='Renthal1!',
            database='shopify_orders_database'
        ) as connection:
            select_orders_query = """SELECT sum(qty) AS sumClaims, count(qty) AS uniqueClaims 
                FROM orders 
                WHERE date BETWEEN %s AND %s AND INSTR(tags, 'warr') > 0
                ORDER BY sumClaims 
                DESC;
            """
            sum_claims = []
            for i in range(0, 24):
                replace_month -= 1
                if replace_month == 0:
                    year = year - 1
                    end_date = end_date.replace(month=replace_month + 1)
                    start_date = start_date.replace(month=12, year=year)
                    replace_month = 12
                else:
                    end_date = end_date.replace(month=replace_month + 1, year=year)
                    start_date = start_date.replace(month=replace_month)
                val_tuple = (start_date, end_date)
                with connection.cursor() as cursor:
                    cursor.execute(select_orders_query, val_tuple)
                    result = cursor.fetchall()
                    # print(type(result[0][0]))
                    if result[0][0] != None:
                        sum_claims.insert(0, float(result[0][0]))
                    else: sum_claims.insert(0, 0)
                dates.insert(0, start_date.strftime("%b"))
    except Error as e:
        print(e)
    # print(sum_claims)
    response_body = {
        "previousYear": sum_claims[0:12],
        "currentYear": sum_claims[12:25],
        "dates": dates[0:12]
    }
    return response_body

def get_monthly_pareto_data():
    year = date.today().year
    replace_month = date.today().month
    end_date = date.today().replace(day=1)
    start_date = end_date.replace(month=replace_month-1)
    dates = [start_date.month]
    try:
        with connect(
            host='localhost',
            user='root',
            password='Renthal1!',
            database='shopify_orders_database'
        ) as connection:
            select_orders_query = """
                SELECT sku, sum(qty) AS sumClaims, count(qty) AS uniqueClaims 
                FROM orders 
                WHERE date BETWEEN %s AND %s AND INSTR(tags, 'warr') > 0 
                GROUP BY sku ORDER BY sumClaims DESC 
                LIMIT 15;
                """
            val_tuple = (start_date, end_date)
            with connection.cursor() as cursor:
                    cursor.execute(select_orders_query, val_tuple)
                    result = cursor.fetchall()
    except Error as e:
        print(e)
    skus = []
    claims = []
    freq = []
    for item in result:
        skus.append(item[0])
        claims.append(float(item[1]))
    total = sum(claims)
    subtotal = 0
    for claim in claims:
        subtotal += claim
        freq.append(subtotal / total)
    response_body = {
        'skus': skus,
        'claims': claims,
        'frequency': freq 
    }
    return response_body

def get_line_chart_data():
    # gather data from database, put into list and return 3 datasets, current year, Previous year, dates
    # each yearly dataset contains 10 lists of data corresponding to skus
    year = date.today().year
    replace_month = date.today().month
    end_date = date.today().replace(day=1)
    start_date = end_date.replace(month=replace_month)
    dates = [start_date.month]
    try:
        with connect(
            host='localhost',
            user='root',
            password='Renthal1!',
            database='shopify_orders_database'
        ) as connection:
            select_orders_query = """
                SELECT sku, sum(qty) AS sumClaims, count(qty) AS uniqueClaims 
                FROM orders 
                WHERE date BETWEEN %s AND %s AND INSTR(tags, 'warr') > 0 
                GROUP BY sku ORDER BY sumClaims DESC 
                LIMIT 10;
                """
            sum_claims = []
            for i in range(0, 24):
                replace_month -= 1
                if replace_month == 0:
                    year = year - 1
                    end_date = end_date.replace(month=replace_month + 1)
                    start_date = start_date.replace(month=12, year=year)
                    replace_month = 12
                else:
                    end_date = end_date.replace(month=replace_month + 1, year=year)
                    start_date = start_date.replace(month=replace_month)

                val_tuple = (start_date, end_date)

                with connection.cursor() as cursor:
                    cursor.execute(select_orders_query, val_tuple)
                    result = cursor.fetchall()
                    print(result)
                    if result[0][0] != None:
                        sum_claims.insert(0, float(result[0][0]))
                    else: sum_claims.insert(0, 0)
                    
                dates.insert(0, start_date.strftime("%b"))
    except Error as e:
        print(e)
    # print(sum_claims)
    response_body = {
        "previousYear": sum_claims[0:12],
        "currentYear": sum_claims[12:25],
        "dates": dates[0:12]
    }
    return response_body
if __name__ == "__main__":
    print(get_monthly_pareto_data())