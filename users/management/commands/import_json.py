from django.core.management.base import BaseCommand
import json

# import sys
# sys.path.append('/users')
from users.models import Nodes

# List of JSON files to import
json_files = [
    '/src/json-files/park_locations.json',
     "/src/json-files/park_node_locations",
    "/src/json-files/worship_locations",
    "/src/json-files/museum_art_locations",
    "/src/json-files/library_locations",
    "/src/json-files/walking_node_locations",
    "/src/json-files/community_locations" 
]

# file_path = r'C:\Users\corma\COMP47360\ucdSummerProject\src\json-files\museum_art_locations.json'
class Command(BaseCommand):
    help = 'Import JSON file into PostgreSQL'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help='Path to the JSON file')

    def handle(self, *args, **options):
    
        file_path = options['file_path']

        # for file_path in json_files:
        with open(file_path) as f:
            data = json.load(f)

        for item in data['data']:
            node = Nodes(
                id_str=item['id'],
                name=item['name'],
                type=item['type'],
                address=item['address'],
                internet_access=item['internet_access'],
                wheelchair_accessible=item['wheelchair_accessible'],
                opening_hours=item['opening_hours'],
                grid_id=item['grid-id'],
                taxi_zone=item['taxi-zone'],
                precinct=item['precinct'],
                b_score=item['b-score'],
                c_score=item['c-score'],
                rating=item['rating'],
                latitude=item['location']['latitude'],
                longitude=item['location']['longitude'],
            )
            node.save()