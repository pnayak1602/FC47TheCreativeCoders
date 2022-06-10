import requests

def Joke( ): 
    api_address='https://v2.jokeapi.dev/joke/Any'
    url = api_address

    response = requests.get(url)
    response = response.json()

    if(response['type']=='twopart'):
        format_add = response['setup'] + '\n'+response['delivery']  
    else:
        format_add = response['joke']     

    return format_add
'''import requests    
api_address='https://v2.jokeapi.dev/joke/Any'
url = api_address

response = requests.get(url)
response = response.json()

if(response['type']=='twopart'):
    format_add = response['setup'] + '\n'+response['delivery']  
else:
    format_add = response['joke']     

print(format_add)  '''