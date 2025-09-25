import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { FolderPlus, FilePlus, Folder, File } from "lucide-react";
import API from "@/api/api";


interface FileItem {
  id: number;
  nombre: string;
  url: string;
}

interface FolderItem {
  id: number;
  nombre: string;
  parent_id?: number;
}


const ManualesMateriales: React.FC = () => {
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folder, setFolder] = useState<FolderItem | null>(null);
  const [subfolders, setSubfolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [path, setPath] = useState<FolderItem[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar carpeta raíz al montar
  useEffect(() => {
    fetchFolder(null);
    // eslint-disable-next-line
  }, []);

  const fetchFolder = async (folderId: number | null) => {
    setLoading(true);
    try {
      const params = folderId ? { folder_id: folderId } : {};
      const response = await API.get("/api/materiales/folder", { params });
      if (response.status === 200) {
        setFolder(response.data.folder);
        setSubfolders(response.data.subfolders);
        setFiles(response.data.files);
        if (!folderId) {
          setPath([response.data.folder]);
          setCurrentFolderId(response.data.folder.id);
        } else {
          setPath(prev => {
            const idx = prev.findIndex(f => f.id === folderId);
            if (idx !== -1) return prev.slice(0, idx + 1);
            return [...prev, response.data.folder];
          });
          setCurrentFolderId(folderId);
        }
      }
    } catch (error) {
      console.error("Error al cargar carpeta:", error);
    }
    setLoading(false);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !currentFolderId) return;
    try {
      await API.post("/api/materiales/folder", {
        nombre: newFolderName,
        parent_id: currentFolderId
      });
      setShowFolderModal(false);
      setNewFolderName("");
      fetchFolder(currentFolderId);
    } catch (error) {
      console.error("Error creando carpeta:", error);
    }
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim() || !newFileUrl.trim() || !currentFolderId) return;
    try {
      await API.post("/api/materiales/file", {
        nombre: newFileName,
        url: newFileUrl,
        folder_id: currentFolderId
      });
      setShowFileModal(false);
      setNewFileName("");
      setNewFileUrl("");
      fetchFolder(currentFolderId);
    } catch (error) {
      console.error("Error creando archivo:", error);
    }
  };

  const handleOpenFolder = (id: number) => {
    fetchFolder(id);
  };

  const handleGoBack = () => {
    if (path.length > 1) {
      const prev = path[path.length - 2];
      fetchFolder(prev.id);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manuales y Materiales</h1>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Button onClick={handleGoBack} disabled={path.length === 1} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-lg">
            Volver
          </Button>
          <Button onClick={() => setShowFolderModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-1">
            <FolderPlus className="w-4 h-4" /> Nueva carpeta
          </Button>
          <Button onClick={() => setShowFileModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1">
            <FilePlus className="w-4 h-4" /> Nuevo archivo
          </Button>
        </div>
        <div className="mb-4 text-gray-700 font-semibold">Ruta: {path.map(f => f.nombre).join(" / ")}</div>
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-8">
              <span className="text-blue-700 font-medium">Cargando...</span>
            </div>
          ) : (
            <>
              {subfolders.map(f => (
                <div key={f.id} className="bg-blue-50 rounded-lg p-4 flex items-center gap-2 cursor-pointer hover:bg-blue-100" onClick={() => handleOpenFolder(f.id)}>
                  <Folder className="w-6 h-6 text-blue-600" />
                  <span className="font-semibold text-blue-800">{f.nombre}</span>
                </div>
              ))}
              {files.map(file => (
                <a key={file.id} href={file.url} target="_blank" rel="noopener noreferrer" className="bg-green-50 rounded-lg p-4 flex items-center gap-2 hover:bg-green-100">
                  <File className="w-6 h-6 text-green-600" />
                  <span className="font-semibold text-green-800">{file.nombre}</span>
                </a>
              ))}
              {subfolders.length === 0 && files.length === 0 && (
                <div className="col-span-2 text-gray-400 text-center py-8">Esta carpeta está vacía.</div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Modal Nueva Carpeta */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Nueva Carpeta</h2>
            <Input
              id="folderName"
              name="folderName"
              label="Nombre de la carpeta"
              type="text"
              placeholder="Ejemplo: Documentos"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowFolderModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">Cancelar</Button>
              <Button onClick={handleCreateFolder} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Crear</Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Nuevo Archivo */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Nuevo Archivo</h2>
            <Input
              id="fileName"
              name="fileName"
              label="Nombre del archivo"
              type="text"
              placeholder="Ejemplo: Manual.pdf"
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <Input
              id="fileUrl"
              name="fileUrl"
              label="Enlace del archivo"
              type="text"
              placeholder="https://..."
              value={newFileUrl}
              onChange={e => setNewFileUrl(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowFileModal(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg">Cancelar</Button>
              <Button onClick={handleCreateFile} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Crear</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualesMateriales;
