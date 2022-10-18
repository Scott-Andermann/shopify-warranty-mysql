from mysql.connector import connect, Error
import csv

if __name__ == "__main__":

    try:
        with connect(
            host='localhost',
            # user=input('Enter Username: '),
            # password=getpass('Enter Password: '),
            user='root',
            password='Renthal1!',
            database='shopify_orders_database'
        ) as connection:
            create_db_query = "CREATE DATABASE shopify_orders_database"
            create_users_table_query = """CREATE TABLE users(
                cust_id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100),
                state VARCHAR(2),
                zipcode VARCHAR(5)
                )
                """
            create_parts_table_query = """CREATE TABLE parts(
                sku VARCHAR(10) PRIMARY KEY,
                part_name VARCHAR(100),
                price DECIMAL(7,2)
                )
                """
            create_orders_table_query = """CREATE TABLE orders(
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id VARCHAR(14),
                order_name VARCHAR(100),
                cust_id INT,
                address VARCHAR(100),
                city VARCHAR(100),
                state VARCHAR(100),
                zip_code VARCHAR(10),
                country_code VARCHAR(2),
                date DATE,
                note VARCHAR(100),
                tags VARCHAR(100),
                sku VARCHAR(10),
                qty INT,
                price DECIMAL(6,2),
                FOREIGN KEY (sku) REFERENCES parts(sku),
                FOREIGN KEY (cust_id) REFERENCES users(cust_id)
                )
                """
            insert_parts_query = """
            INSERT INTO parts
            (sku, part_name)
            VALUES(%s, %s)
            """
            parts = []
            with open('part_names.csv', encoding='utf-8-sig') as f:
                data = csv.reader(f)
                count = True
                for row in data:
                    try:
                        parts.append((row[0], row[1][0:100]))
                    except:
                        pass

            with connection.cursor() as cursor:
                cursor.execute(create_users_table_query)
                # cursor.execute(create_parts_table_query)
                cursor.execute(create_orders_table_query)
                # cursor.executemany(insert_parts_query, parts)
                connection.commit()
            
    except Error as e:
        print(e)