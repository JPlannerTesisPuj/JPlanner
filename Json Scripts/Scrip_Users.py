import json
import requests
import random
import string
import jwt 
def id_generator(some,payload):
    """This is a function for retrieving a random string for student credentials"""
    return jwt.encode({some: payload}, 'secret', algorithm='HS256')

r = requests.get('https://trello-attachments.s3.amazonaws.com/5bd0e33922e9bc6cb9bd828c/5c4640a1afa3fd06460ab2fc/4914a3b27e4ac6534f355a49d763d6c6/classes.json')
json_materias = r.json()
users = list()


for i in range (0,6):
    json_pensum = dict()
    json_pensum["nombre_estudiante"] = input("Nombre estudiante?")
    json_pensum["carrera"] = input("Carrea?")
    json_pensum["semestre"] = input("semestre?")
    json_pensum["credenciales"] = str(id_generator(json_pensum["nombre_estudiante"],"bla")).split("\'")[1]
    json_pensum["asignaturas_aprobadas"] = list()
    users.append(json_pensum)

for s in users:
    for k,v in s.items():
        for i in range(0,random.randint(0,61)):
            dict_pre = dict()
            dict_pre["id_materia_cursada"] =  json_materias[random.randint(0,69)]["_id"] 
            s["asignaturas_aprobadas"].append(dict_pre)

print(json.dumps(users,sort_keys=True, indent=3))
print(len(users))

f= open("users_pensum.json","w+")
f.write(json.dumps(users,sort_keys=True, indent=3))
f.close()



