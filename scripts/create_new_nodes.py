import math

# Central Park - P427818536
# -73.9655077457428 (lon),40.7825317958178 (lat)

#Bottom left corner - Central Park
blc_lat = 40.76809979802234 #y value
blc_lon = -73.98184556738406 #x value

#Bottom right corner - Central Park
brc_lat = 40.7645217879644
brc_lon = -73.973058668744

#Top left corner - Central Park
tlc_lat = 40.800594570557614 #y value
tlc_lon = -73.95818349388941 #x value

#Top Right corner - Central Park
trc_lat = 40.800594570557614
trc_lon = -73.95818349388941

#Number of new nodes to create
horizontal = 2
vertical = 10
total_new_nodes = horizontal * vertical

#Distance on horizontal axis
y_hor = round(abs(blc_lat-brc_lat),5)
x_hor = round(abs(blc_lon-brc_lon),5)
z_hor = round(math.sqrt(y_hor**2 + x_hor**2),5)
print(f'x distance = {x_hor}, y distance = {y_hor} z horizontal distance = {z_hor}')

#Distance on vertical axis
y_ver = round(abs(blc_lat-tlc_lat),5)
x_ver = round(abs(blc_lon-tlc_lon),5)
z_ver = round(math.sqrt(y_ver**2 + x_ver**2),5)
print(f'x distance = {x_ver}, y distance = {y_ver} z vertical distance = {z_ver}')

#Calculate increment (what is to be added to blc_lat and blc_lon )
z_hor_inc = z_hor/(horizontal+1)
z_ver_inc = z_ver/(vertical+1)

list_new_nodes = []
# print(f'Original Node = {round(blc_lon,5)} , {round(blc_lat,5)}')

# for j in range(1,vertical+1):
for i in range(1,horizontal+1):
    new_node = (round(blc_lon - i*z_hor_inc,5),round(blc_lat,5))
    list_new_nodes.append(new_node)
    print(f'New Node = {new_node}')






