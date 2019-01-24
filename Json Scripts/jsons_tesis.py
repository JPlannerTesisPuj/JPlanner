import json
import requests
import random

#request the subjects json
r = requests.get('https://trello-attachments.s3.amazonaws.com/5bd0e33922e9bc6cb9bd828c/5c4640a1afa3fd06460ab2fc/4914a3b27e4ac6534f355a49d763d6c6/classes.json')
json_materias = r.json()
#pensum json to return
pensum = list()


for i in range (0,80):

    #Json that contains the pensum as a dictionary
    json_pensum = dict()
    
    random_subject_id = random.randint(0,69)
    random_prev_subject = 100

    #This is to verify if there's no subjects repeated
    if random_subject_id != random_prev_subject:

        #json_materias is a list, with dictionaries.
        json_pensum["_id"] = json_materias[random_subject_id]["_id"]
        random_prev_subject = random_subject_id
    json_pensum["pre_requisitos"] = list()
    for j in range(0,random.randint(0,15)):
        id = random.randint(0,69)
        previous_id = 100
        #This is to verify if there's no subjects repeated
        if id != previous_id:
            json_pensum["pre_requisitos"].append(json_materias[id]["_id"])
            previous_id = id 
    pensum.append(json_pensum)

#For saving the .json file in the current path
f= open("pensum_80.json","w+")

#Transforming the list into a .json sintaxis
f.write(json.dumps(pensum,sort_keys=True, indent=3))
f.close()


