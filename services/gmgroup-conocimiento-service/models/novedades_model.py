from config.db_mysql import get_mysql_connection

def create_novedad(id_usuario, id_grupo, novedad):
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "INSERT INTO novedades (id_usuario, id_grupo, novedad) VALUES (%s, %s, %s)",
        (id_usuario, id_grupo, novedad)
    )
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return new_id

def get_novedades():
    conn = get_mysql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM novedades ORDER BY created_at DESC")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows
