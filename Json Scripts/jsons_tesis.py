import json
import requests
import random

r = requests.get('https://trello-attachments.s3.amazonaws.com/5bd0e33922e9bc6cb9bd828c/5c4640a1afa3fd06460ab2fc/4914a3b27e4ac6534f355a49d763d6c6/classes.json')
json_materias = r.json()
pensum = list()


for i in range (0,80):
    json_pensum = dict()
    
    random_subject = random.randint(0,69)
    json_pensum["_id"] = json_materias[random_subject]["_id"]
    json_pensum["pre-requisitos"] = list()
    pensum.append(json_pensum)

for s in pensum:
    for k,v in s.items():
        for i in range(0,random.randint(0,15)):
            dict_pre = dict()
            id = random.randint(0,69)
            id_prev = 900000
            if id != id_prev:
                dict_pre["id_pre"] =  json_materias[id]["_id"]
                id_prev = id 
            s["pre-requisitos"].append(dict_pre)

print(json.dumps(pensum,sort_keys=True,indent=3))
print(len(pensum))

f= open("pensum.json","w+")
f.write(json.dumps(pensum,sort_keys=True, indent=3))
f.close()


