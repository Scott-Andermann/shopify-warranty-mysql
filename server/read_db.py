from mysql.connector import connect, Error
from datetime import datetime, date, timedelta

def get_bar_chart_data():
    # TODO gather data from database, put into list and return 3 lists
    # 1. Prev 12 months data
    # 2. 24-12 months data
    # 3. Months
    # year = datetime.now().year
    # month = datetime.now().month
    # date_string = str(year) + "-" + str(month) + "-01"
    # end_date = datetime.strptime(date_string, "%Y-%m-%d").date()
    # start_date = end_date- 365
    year = date.today().year
    replace_month = date.today().month - 1
    end_date = date.today().replace(day=1)
    start_date = end_date.replace(month=replace_month)
    dates = [start_date]
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
            for i in range(1, 24):
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
                    sum_claims.append(result[0][0])
                dates.append(start_date)
    except Error as e:
        print(e)
    response_body = {
        "Current Year": sum_claims[0:12],
        "Previous Year": sum_claims[12:24],
        "dates": dates[0:12]
    }
    return response_body
    
if __name__ == "__main__":
    print(get_bar_chart_data())