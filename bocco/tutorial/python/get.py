import requests
import pprint

def main():
    sensor_data= requests.get('https://api.bocco.me/alpha/rooms/73624ea6-0c94-4f32-bfd5-8806c5497145/sensor_environments/64e8cdcb-390b-46ef-bdfc-c800c4df242c?access_token=6a37258fe6ccc3748313a30552720dd3a29ce3762202d4d09bbf41810f02b701').json()
    pprint.pprint(sensor_data)

if __name__== '__main__':
    main()
