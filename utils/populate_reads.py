import requests
from random import random
from json import dumps

url = 'http://solarpes.herokuapp.com/client/'
user = '3006750425'
panel = 'mypanel'


for i in xrange(100):
    payload = {
        'temperature': 20 + (20 * random()),
        'radiation': random(),
        'current': {
            'network' : random(),
            'panel' : random(),
            'used' : random()
        }
    }
    r = requests.post(url + '/' + user + '/' + panel, json = payload)
