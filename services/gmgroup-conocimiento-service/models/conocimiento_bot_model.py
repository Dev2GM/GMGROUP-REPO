from config.db_mysql import get_mysql_connection

class ConocimientoBotModel:
    @staticmethod
    def get_all():
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM conocimiento_bot ORDER BY created_at DESC")
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result

    @staticmethod
    def add(pregunta, respuesta_correcta, respuesta_erronea=None):
        conn = get_mysql_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO conocimiento_bot (pregunta, respuesta_correcta, respuesta_erronea) VALUES (%s, %s, %s)",
            (pregunta, respuesta_correcta, respuesta_erronea)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return True

    @staticmethod
    def delete(id):
        conn = get_mysql_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM conocimiento_bot WHERE id = %s", (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return True
