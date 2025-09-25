import chromadb
import os
from dotenv import load_dotenv

load_dotenv()

def get_chroma_client():
    client = chromadb.PersistentClient(path=os.getenv("CHROMA_PATH", "./chroma_db"))
    return client
