import shopify
from mysql.connector import connect, Error
from dotenv import load_dotenv
import os



def init_shopify():
    load_dotenv()

    access_token = os.environ['access_token']
    API_KEY = os.environ['API_KEY']
    API_SECRET = os.environ['API_SECRET']

    shopify.Session.setup(api_key=API_KEY, secret=API_SECRET)

    shop_url = 'fzspray.myshopify.com'
    api_version = '2022-04'

    session = shopify.Session(shop_url, api_version, access_token)
    shopify.ShopifyResource.activate_session(session)

def get_user(connection, email):
    # print(email)
    data = [(email)]
    select_user_query="""SELECT cust_id FROM users WHERE email=%s"""
    with connection.cursor() as cursor:
        cursor.execute(select_user_query, data)
        result = cursor.fetchall()
        for row in result:
            cust_id = row[0]
    return cust_id

def add_user(connection, name, email, state, zip):
    print('adding new user: ', email)
    # print(state)
    insert_user_query = """
        INSERT INTO users
        (name, email, state, zipcode)
        VALUES ( %s, %s, %s, %s )"""
    val_tuple = (name, email, state[0:2], zip)
    with connection.cursor() as cursor:
        cursor.execute(insert_user_query, val_tuple)
        connection.commit()
    return (get_user(connection, email))
    # return cust_id

def add_part(connection, sku, part_name, price):
    print('adding new part: ', sku)
    insert_part_query = """
    INSERT INTO parts
    (sku, part_name, price)
    VALUES ( %s, %s, %s )
    """
    val_tuple = (sku, part_name, price)
    with connection.cursor() as cursor:
        cursor.execute(insert_part_query, val_tuple)
        connection.commit()

def check_sku(connection, sku):
    select_part_query = "SELECT * from parts WHERE sku = %s;"
    val = [(sku)]
    with connection.cursor() as cursor:
        cursor.execute(select_part_query, val)
        result = cursor.fetchall()
        print(result)
        if len(result) == 0:
            return False
    return True


def check_user(connection, email):
    select_user_query = "SELECT * from users WHERE email = %s;"
    val = [(email)]
    with connection.cursor() as cursor:
        cursor.execute(select_user_query, val)
        result = cursor.fetchall()
        print(result)
        if len(result) == 0:
            return False
    return True


def add_order(connection, order_attributes):
    print('Adding order: ', order_attributes[0])
    print(order_attributes)
    insert_order_query = """
        INSERT INTO orders
        (order_id, order_name, cust_id, address, city, state, zip_code, country_code, date, note, tags, sku, qty, price)
        VALUES ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s )"""
    val_tuple = order_attributes
    with connection.cursor() as cursor:
        cursor.execute(insert_order_query, val_tuple)
        connection.commit()

def get_orders(connection, last):
    orders = shopify.Order.find(limit = 250, status='any', since_id=int(last))
    for order in orders:
        if order.cancelled_at != None:
            print('skipping due to cancelled order')
            continue
        last = order.id
        try:
            if not check_user(connection, order.email):
                cust_id = add_user(connection, order.billing_address.name, order.email, order.billing_address.province_code, order.billing_address.zip[:5])
            else: 
                print('user already exists')
                cust_id = get_user(connection, order.email)
            # print(cust_id)
            if order.note == None:
                note = ''
            else: note = order.note[0:99]
            order_attributes = [
                    order.id,
                    order.name, 
                    cust_id,
                    f'{order.billing_address.address1} {order.billing_address.address2}',
                    order.billing_address.city, 
                    order.billing_address.province_code[0:2], 
                    order.billing_address.zip[:5],
                    order.billing_address.country_code, 
                    order.created_at[:10], 
                    note, 
                    order.tags]
            # get each SKU and qty on order - separate from the order information
            for item in order.line_items:
                if item.fulfillment_status == 'fulfilled':
                    if item.sku != None and item.sku != '':
                        if item.sku[0] not in ['X', 'S', 'F']: 
                            continue
                        line_item = [item.sku[0:6], item.quantity, item.price]
                        # add sku to part list if not already in part list
                        if not check_sku(connection, item.sku[0:6]):
                            add_part(connection, item.sku[0:6], item.name, item.price)
                        line_item_attributes = order_attributes + line_item
                        add_order(connection, line_item_attributes)
        except AttributeError as e:
            print(f'Erorr: {e}')
    # input(last)
    if len(orders) == 250:
        get_orders(connection, last)

def update_database():
    init_shopify()
    print('updating...')
    try:
        with connect(
            host='localhost',
            # user=input('Enter Username: '),
            # password=getpass('Enter Password: '),
            user='root',
            password='Renthal1!',
            database='shopify_orders_database'
        ) as connection:
            select_last_order_query = """SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1"""
            with connection.cursor() as cursor:
                cursor.execute(select_last_order_query)
                result = cursor.fetchall()
                try:
                    last = result[0][0]
                except IndexError:
                    last = 0
            # print(last)
            get_orders(connection, last)
    except Error as e:
        print(e)

if __name__ == "__main__":
    update_database()

# basic workflow is get_new orders on page-load
# Then query by part number to

