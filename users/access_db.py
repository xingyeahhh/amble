import psycopg2

#Set up environmental variables
from dotenv import load_dotenv
import os
load_dotenv()

def checklogin (username,password):

    # Establish a connection to PostgreSQL
    conn = psycopg2.connect(
    host='127.0.0.1',
    database= os.environ.get('DATABASE_NAME'),
    user=os.environ.get('DATABASE_USER'),
    password=os.environ.get('DATABASE_PASS'),
)
    cursor = conn.cursor() # Create a cursor object to execute SQL queries

    query = "SELECT * FROM public.users_user"
    cursor.execute(query)
    results = cursor.fetchall() # Fetch the results

    check = False
    for r in results:
        print(r[3],r[5])
        if r[3] == str(password) and r[5] == str(username):
            check = True
            firstname = r[0]
            lastname=r[1]
            address = r[2]
            print(f'Hi {firstname}!  Welcome back.')
            print(f'There is a match so = {check}')
            return check,firstname,lastname, address
    print(f'There is NO match so = {check}')  

    # print('\n------------------ Query------------------------------\n')
    # for r in results:
    #     print(f'Password = {r[3]} : Username = {r[5]}') 

    return check,results

# Close the cursor and database connection
    cursor.close()
    conn.close()

# # # Execute some sample SQL queries to select data
# # query = "SELECT * FROM users_nodes WHERE type = 'park' and name != 'Unknown Park'"
# # cursor.execute(query)
# # results = cursor.fetchall() # Fetch the results
# # # Execute some sample SQL queries to select data
# # query = "SELECT * FROM users_nodes WHERE type = 'park' and name != 'Unknown Park'"
# # cursor.execute(query)
# # results = cursor.fetchall() # Fetch the results

# # query2 = "SELECT * FROM public.users_nodes WHERE wheelchair_accessible = 'yes' and type = 'library'"
# # cursor.execute(query2)
# # results2 = cursor.fetchall() # Fetch the results
# # query2 = "SELECT * FROM public.users_nodes WHERE wheelchair_accessible = 'yes' and type = 'library'"
# # cursor.execute(query2)
# # results2 = cursor.fetchall() # Fetch the results

# # query3 = "SELECT * FROM public.users_userpref"
# # cursor.execute(query3)
# # results3 = cursor.fetchall() # Fetch the results
# # query3 = "SELECT * FROM public.users_userpref"
# # cursor.execute(query3)
# # results3 = cursor.fetchall() # Fetch the results
