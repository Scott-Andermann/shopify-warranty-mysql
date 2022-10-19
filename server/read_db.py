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

def get_top_monthly_claims(num = 10):
    replace_month = date.today().month
    end_date = date.today().replace(day=1)
    start_date = end_date.replace(month=replace_month-1)
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
                LIMIT %s;
                """
            val_tuple = (start_date, end_date, num)
            with connection.cursor() as cursor:
                    cursor.execute(select_orders_query, val_tuple)
                    result = cursor.fetchall()
    except Error as e:
        print(e)
    skus = []
    claims = []
    for item in result:
        skus.append(item[0])
        claims.append(float(item[1]))

    return skus, claims

def get_claims_by_sku(sku_list):
    response_body = {}
    for sku in sku_list:
        year = date.today().year
        replace_month = date.today().month
        end_date = date.today().replace(day=1)
        start_date = end_date.replace(month=replace_month)
        dates = []
        # print(sku)
        try:
            with connect(
                host='localhost',
                user='root',
                password='Renthal1!',
                database='shopify_orders_database'
            ) as connection:
                select_orders_query = """SELECT sum(qty) AS sumClaims
                    FROM orders 
                    WHERE date BETWEEN %s AND %s AND INSTR(tags, 'warr') > 0 AND sku = %s;
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
                    val_tuple = (start_date, end_date, sku)
                    with connection.cursor() as cursor:
                        cursor.execute(select_orders_query, val_tuple)
                        result = cursor.fetchall()
                        if result[0][0] != None:
                            sum_claims.insert(0, float(result[0][0]))
                        else: sum_claims.insert(0, 0)

                    dates.insert(0, start_date.strftime("%b"))
                response_body[sku] = sum_claims
        except Error as e:
            print(e)
        response_body['Dates'] = dates
    return response_body
    

def get_monthly_pareto_data():
    skus, claims = get_top_monthly_claims(15)
    freq = []
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
    # TODO 
    # get list of part numbers
    # query each part number
    skus, claims = get_top_monthly_claims()
    # print(skus)
    response_body = get_claims_by_sku(skus)
    return response_body


if __name__ == "__main__":
    print(get_line_chart_data())