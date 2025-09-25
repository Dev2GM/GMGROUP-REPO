const { getGroupsByUserId, getGroupsByEmpresa } = require("../models/group.model");

/**
 * Obtener los grupos de un usuario
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Array de grupos
 */
const getEmpresaGroups = async (req, res) => {
  try {
    if (!req.user) {
        return res.status(403).json({
            success: false,
            message: "Forbidden"
        });
    }
    const id_empresa = req.user.id_empresa;
    if (!id_empresa) {
      return res.status(400).json({
        success: false,
        message: "El id_empresa es requerido"
      });
    }

    const grupos = await getGroupsByEmpresa(id_empresa);

    if (!grupos || grupos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron grupos para este usuario"
      });
    }

    res.status(200).json({
      success: true,
      groups: grupos
    });
  } catch (error) {
    console.error("Error en getGroupsByEmpresa:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
      error: error.message
    });
  }
};


/**
 * Obtener los grupos de un usuario
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Array de grupos
 */
const getUserGroups = async (req, res) => {
  try {
    if (!req.user) {
        return res.status(403).json({
            success: false,
            message: "Forbidden"
        });
    }
    const id_usuario = req.user.id;
    if (!id_usuario) {
      return res.status(400).json({
        success: false,
        message: "El id_usuario es requerido"
      });
    }

    const grupos = await getGroupsByUserId(id_usuario);

    if (!grupos || grupos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron grupos para este usuario"
      });
    }

    res.status(200).json({
      success: true,
      groups: grupos
    });
  } catch (error) {
    console.error("Error en getUserGroups:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
      error: error.message
    });
  }
};


module.exports = {
  getUserGroups,
  getEmpresaGroups
};
