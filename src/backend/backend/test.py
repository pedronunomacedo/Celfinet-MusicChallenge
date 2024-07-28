from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

try:
    # client = MongoClient('mongodb+srv://Cluster27411:cGtCandsa3BS@cluster27411.hcutpri.mongodb.net/AlbumAppDB?retryWrites=true&w=majority', 
    #                      'Cluster27411',
    #                      'cGtCandsa3BS',
    #                      authMechanism='SCRAM-SHA-1', 
    #                      ssl=True, 
    #                      ssl_cert_reqs='CERT_NONE')
    client = MongoClient('mongodb+srv://Cluster27411:cGtCandsa3BS@cluster27411.hcutpri.mongodb.net/AlbumAppDB?retryWrites=true&w=majority')
    db = client['AlbumAppDB']
    print("Connection successful!")
except Exception as e:
    print("Error connecting to MongoDB:", e)