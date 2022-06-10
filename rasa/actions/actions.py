# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"
from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
from api import Joke , Quotes


#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []
class ActionHelloWorld(Action):
     print(Action)
     def name(self) -> Text:
        return "action_api"

     def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        print("Inside action")
        if((tracker.latest_message['intent'].get('name'))=="joke"):
         response=Joke()    
         if(response['type']=='twopart'):
            joke = response['setup'] + '\n'+response['delivery']  
         else:
            joke = response['joke']     
         dispatcher.utter_template("utter_joke",tracker,text=joke)

        else:
         response=Quotes()
                 
         dispatcher.utter_template("utter_quote",tracker,text=(response['q'])) 

        return []


