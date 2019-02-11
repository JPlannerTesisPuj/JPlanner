import json
import requests
import random
import collections

#request the subjects json
r = requests.get('https://trello-attachments.s3.amazonaws.com/5bd0e33922e9bc6cb9bd828c/5c4640a1afa3fd06460ab2fc/4914a3b27e4ac6534f355a49d763d6c6/classes.json')
json_materias = r.json()
#pensum json to return
pensum = list()
counter = 0
random_subject_id = random.sample(range(69), 56)

for i in range (0,55):
    # Json that contains the pensum as a dictionary
    json_pensum = dict()
    # json_materias is a list, with dictionaries.
    json_pensum["_id"] = json_materias[random_subject_id[counter]]["_id"]
    json_pensum["pre_requisitos"] = list()
    # This is to verify if there's no subjects repeated, returns a list with 15 numbers in a range
    # between 0 to 69
    id = random.sample(range(69), 15)
    for j in range(0,random.randint(0,15)):
        if random_subject_id == id[j]:
            continue
        else:
            json_pensum["pre_requisitos"].append(json_materias[id[j]]["_id"])
    pensum.append(json_pensum)
    counter += 1
   

# For saving the .json file in the current path
f= open("pensum_55.json","w+")
# Transforming the list into a .json sintaxis
f.write(json.dumps(pensum,sort_keys=True, indent=3))
f.close()
