from mysql.connector import connect, Error
from datetime import datetime, date, timedelta


def get_bar_chart_data(query, sku=''):
    # gather data from database, put into list and return 3 datasets, current year, Previous year, dates
    year = date.today().year
    replace_month = date.today().month
    today_date = date.today()
    end_date = date.today().replace(day=1)
    start_date = end_date.replace(month=replace_month)
    dates = [end_date.month]
    try:
        with connect(
            host='localhost',
            user='root',
            password='Renthal1!',
            database='shopify_orders_database'
        ) as connection:
            # select_orders_query = """SELECT sum(qty) AS sumClaims, count(qty) AS uniqueClaims 
            #     FROM orders 
            #     WHERE date BETWEEN %s AND %s AND INSTR(tags, 'warr') > 0
            #     ORDER BY sumClaims 
            #     DESC;
            # """
            sum_claims = []
            if sku == '':
                val_tuple = (end_date, today_date)
            else: val_tuple = (end_date, today_date, sku)
            with connection.cursor() as cursor:
                cursor.execute(query, val_tuple)
                result = cursor.fetchall()
                # print(type(result[0][0]))
                if result[0][0] != None:
                    sum_claims.insert(0, float(result[0][0]))
                else: sum_claims.insert(0, 0)
            dates.insert(0, start_date.strftime("%b"))
            for i in range(0, 23):
                replace_month -= 1
                if replace_month == 0:
                    year = year - 1
                    end_date = end_date.replace(month=replace_month + 1)
                    start_date = start_date.replace(month=12, year=year)
                    replace_month = 12
                else:
                    end_date = end_date.replace(month=replace_month + 1, year=year)
                    start_date = start_date.replace(month=replace_month)
                if sku == '':
                    val_tuple = (start_date, end_date)
                else: val_tuple = (start_date, end_date, sku)
                with connection.cursor() as cursor:
                    cursor.execute(query, val_tuple)
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

def get_top_monthly_claims(offset=0, num = 10):
    replace_month = date.today().month
    today_date = date.today()
    end_date = date.today().replace(day=1)
    start_date = end_date.replace(month=replace_month-1)
    skus = []
    claims = []
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
                LIMIT %s, %s;
                """

            val_tuple = (start_date, end_date, offset, num)
            with connection.cursor() as cursor:
                    cursor.execute(select_orders_query, val_tuple)
                    result = cursor.fetchall()

                    for item in result:
                        skus.append(item[0])
                        claims.append(float(item[1]))
    except Error as e:
        print(e)

    return skus, claims

def get_claims_by_sku(sku_list):
    response_body = {}
    trace_data = []
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
                trace_data.append({sku: sum_claims})
        except Error as e:
            print(e)
    response_body['Dates'] = dates
    response_body['traces'] = trace_data
    return response_body
    
def get_monthly_pareto_data():
    skus, claims = get_top_monthly_claims(0, 15)
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

def get_line_chart_data(offset):
    skus, claims = get_top_monthly_claims(offset, 10)
    response_body = get_claims_by_sku(skus)
    return response_body

def get_parts_table_data(offset=0):
    skus, claims = get_top_monthly_claims(offset)
    select_sku_query = """
        SELECT part_name FROM parts WHERE sku = %s"""
    select_orders_query = """SELECT sum(qty) AS sumClaims
        FROM orders 
        WHERE date BETWEEN %s AND %s AND INSTR(tags, 'warr') > 0 AND sku = %s;
        """
    end_date = date.today().replace(day=1)
    start_date = end_date.replace(year=end_date.year-1)
    response_body = []
    try:
        with connect(
            host='localhost',
            user='root',
            password='Renthal1!',
            database='shopify_orders_database'
        ) as connection:
            for i in range(0, len(skus)):
                sku_val_tuple = [(skus[i])]
                val_tuple = (start_date, end_date, skus[i])
                # print(val_tuple)
                with connection.cursor() as cursor:
                    cursor.execute(select_sku_query, sku_val_tuple)
                    name = cursor.fetchall()[0][0]
                    cursor.execute(select_orders_query, val_tuple)
                    year_claims = cursor.fetchall()[0][0]
                response_body.append({"sku": skus[i], "description": name, "lastMonth": claims[i], "yearClaims": year_claims})
    except Error as e:
            print(e)
    return response_body
 
def search_by_term(term):
    select_search_term_query ="""
        SELECT * FROM parts
        WHERE INSTR(sku, %s) OR INSTR(part_name, %s)
        LIMIT 20;
        """
    val_tuple = (term, term)
    parts = []
    try:
        with connect(
            host='localhost',
            user='root',
            password='Renthal1!',
            database='shopify_orders_database'
        ) as connection:
            # print(val_tuple)
            with connection.cursor() as cursor:
                cursor.execute(select_search_term_query, val_tuple)
                result = cursor.fetchall()
                for part in result:
                    parts.append(part)
    except Error as e:
            print(e)
    return parts

def get_orders_by_zip(query, sku=''):
    val_tuple = sku
    if sku == '': val_tuple = [(sku)]
    try:
        with connect(
            host='localhost',
            user='root',
            password='Renthal1!',
            database='shopify_orders_database'
        ) as connection:
            with connection.cursor() as cursor:
                cursor.execute(query, val_tuple)
                result = cursor.fetchall()
                return result
                # print(result)
    except Error as e:
        print(e)

def get_zip_loc(orders):
    zip_query = """SELECT lat, lng FROM zip WHERE zip = %s"""
    loc_list = [] # list of objects {zip, count, lat, lng}
    try:
        with connect(
            host='localhost',
            user='root',
            password='Renthal1!',
            database='shopify_orders_database'
        ) as connection:
            max_count = 1
            for order in orders:
                try:
                    val_tuple = [(int(order[0]))]
                except ValueError:
                    continue
                # print(val_tuple)
                with connection.cursor() as cursor:
                    cursor.execute(zip_query, val_tuple)
                    result = cursor.fetchall()
                    # print(result[0])
                    try:
                        if float(order[1]) > max_count: max_count = float(order[1])
                        loc_list.append({"zip_code": order[0], "count": float(order[1]), "count_intensity": float(order[1]) / max_count * 3, "lat": float(result[0][0]), "lng": float(result[0][1]), "warr_intensity": 0})
                    except IndexError:
                        continue
    except Error as e:
        print(e)

    return loc_list, max_count

def get_warr_by_zip(query, loc_list, max_count, sku=''):
    val_tuple = sku
    if sku == '': val_tuple = [(sku)]
    try:
        with connect(
            host='localhost',
            user='root',
            password='Renthal1!',
            database='shopify_orders_database'
        ) as connection:
            with connection.cursor() as cursor:
                cursor.execute(query, val_tuple)
                result = cursor.fetchall()
                for claim in result:
                    index = next((i for i, item in enumerate(loc_list) if item["zip_code"] == claim[0]), None)
                    if index != None:
                        loc_list[index]["warr"] = float(claim[1])
                        loc_list[index]["warr_intensity"] = float(claim[1]) / max_count * 3
    except Error as e:
        print(e)

    return loc_list
    

if __name__ == "__main__":
    query = """SELECT zip_code, sum(qty) AS sum
    FROM orders
    WHERE sku = %s GROUP BY zip_code
    """
    warr_query = """SELECT zip_code, sum(qty) AS sum
    FROM orders
    WHERE sku = %s AND INSTR(tags, 'warr') > 0 GROUP BY zip_code
    """
    # query = query + "AND INSTR(tags, 'warr') > 0"
    orders = get_orders_by_zip(query, 'FZAAEN')
    loc_list, max_count = get_zip_loc(orders)
    input(max_count)
    print(get_warr_by_zip(warr_query, loc_list, max_count, 'FZAAEN')[0])

        

    # print(search_by_term('pump'))