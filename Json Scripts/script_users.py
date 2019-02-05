import json
import requests
import random
import string
import jwt 
def id_generator(some,payload):
    """This is a function for retrieving a JWT token for student credentials"""
    return jwt.encode({some: payload}, 'secret', algorithm='HS256')

#Request the subjects json
r = requests.get('https://trello-attachments.s3.amazonaws.com/5bd0e33922e9bc6cb9bd828c/5c4640a1afa3fd06460ab2fc/4914a3b27e4ac6534f355a49d763d6c6/classes.json')
json_materias = r.json()

#Taken subjects list
users = list()


for i in range (0,6):
    #Dictionary that contains all the student information
    json_pensum = dict()
    json_pensum["nombre_estudiante"] = input("Nombre estudiante?")
    json_pensum["carrera"] = input("Carrea?")
    json_pensum["semestre"] = input("semestre?")
    json_pensum["credenciales"] = str(id_generator(json_pensum["nombre_estudiante"],"payload")).split("\'")[1]
    json_pensum["asignaturas_aprobadas"] = list()
    users.append(json_pensum)

for student in users:
    for key,value in student.items():
        for i in range(0,random.randint(0,61)):
            id = random.sample(range(69), 69)
            student["asignaturas_aprobadas"].append(json_materias[id[i]]["_id"])



