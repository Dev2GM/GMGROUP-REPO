from config.db_mysql import get_mysql_connection

class MaterialesModel:
    @staticmethod
    def get_folder(folder_id=None):
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        if folder_id:
            cursor.execute("SELECT * FROM materiales_folder WHERE id = %s", (folder_id,))
            folder = cursor.fetchone()
        else:
            cursor.execute("SELECT * FROM materiales_folder WHERE parent_id IS NULL LIMIT 1")
            folder = cursor.fetchone()
        cursor.close()
        conn.close()
        return folder

    @staticmethod
    def get_subfolders(parent_id):
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM materiales_folder WHERE parent_id = %s", (parent_id,))
        folders = cursor.fetchall()
        cursor.close()
        conn.close()
        return folders

    @staticmethod
    def get_files(folder_id):
        conn = get_mysql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM materiales_file WHERE folder_id = %s", (folder_id,))
        files = cursor.fetchall()
        cursor.close()
        conn.close()
        return files

    @staticmethod
    def create_folder(nombre, parent_id=None):
        conn = get_mysql_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO materiales_folder (nombre, parent_id) VALUES (%s, %s)", (nombre, parent_id))
        conn.commit()
        cursor.close()
        conn.close()
        return True

    @staticmethod
    def create_file(nombre, url, folder_id):
        conn = get_mysql_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO materiales_file (nombre, url, folder_id) VALUES (%s, %s, %s)", (nombre, url, folder_id))
        conn.commit()
        cursor.close()
        conn.close()
        return True
