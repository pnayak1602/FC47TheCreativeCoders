from html import entities
from flask import Flask, render_template, request, jsonify, Blueprint
import os,sys,requests, json
from matplotlib.font_manager import json_dump
from random import randint
import os

app = Flask(__name__,template_folder='templates')
app.config['EXPLAIN_TEMPLATE_LOADING'] = True
@app.route('/')
def home():
  return render_template('index.html')
@app.route('/extract', methods=['GET','POST'])
def extract():
  text =  request.get_json(force=True) 
  print(text)
  payload = json.dumps({"sender": "Rasa","message": text})
  headers = {'Content-type': 'application/json', 'Accept':     'text/plain'}
  response = requests.request("POST",   url="http://localhost:5005/webhooks/rest/webhook", headers=headers, data=payload)
  print(response)
  response=response.json()

  resp=[]
  for i in range(len(response)):
    try:
      resp.append(response[i]['text'])
    except:
      continue
  result=resp
  print(result)
  result=''.join(result)
  print(result)
  return (result)
if __name__ == "__main__":
  app.run(debug=True) 


    




