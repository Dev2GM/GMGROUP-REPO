from config.db_chroma import get_chroma_client

def get_faq_collection():
    client = get_chroma_client()
    return client.get_or_create_collection(name="preguntas_frecuentes")

def create_faq(pregunta, respuesta):
    collection = get_faq_collection()
    collection.add(
        documents=[pregunta],
        metadatas=[{"respuesta": respuesta}],
        ids=[f"faq_{pregunta[:20]}"]  # puedes usar uuid para mayor seguridad
    )
    return {"pregunta": pregunta, "respuesta": respuesta}

def buscar_faqs(texto, top_k=5):
    collection = get_faq_collection()
    results = collection.query(
        query_texts=[texto],
        n_results=top_k
    )
    # Reorganizar la salida en algo más limpio
    faqs = []
    for i in range(len(results["documents"][0])):
        if "distances" in results and results["distances"][0][i] < 1:
            faqs.append({
                "pregunta": results["documents"][0][i],
                "respuesta": results["metadatas"][0][i].get("respuesta", None),
                "score": results["distances"][0][i]
            })
    return faqs

def get_unanswered_questions():
    """
    Devuelve todas las preguntas que no tienen respuesta en ChromaDB.
    """
    collection = get_faq_collection()
    results = collection.get()  # obtiene todos los documentos

    unanswered = []
    for idx, metadata in enumerate(results["metadatas"]):
        if metadata and not metadata.get("respuesta"):  # sin respuesta
            unanswered.append({
                "id": results["ids"][idx],
                "pregunta": results["documents"][idx],
                "respuesta": None
            })

    return unanswered

def get_all_questions():
    """
    Devuelve todas las preguntas que no tienen respuesta en ChromaDB.
    """
    collection = get_faq_collection()
    results = collection.get()  # obtiene todos los documentos

    unanswered = []
    for idx, metadata in enumerate(results["metadatas"]):
        unanswered.append({
            "id": results["ids"][idx],
            "pregunta": results["documents"][idx],
            "respuesta": results["metadatas"][idx].get("respuesta", None),
        })

    return unanswered
