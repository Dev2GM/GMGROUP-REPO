import React, { useState, useEffect } from 'react';
import { Star, Phone, Plus, X, Search, Calendar, Clock, MapPin, Image, LogOut  } from 'lucide-react';
import API from "..//api"
import Swal from 'sweetalert2';
import axios from "axios"
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEventoForm, setMostrarEventoForm] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('servicios');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarComentario, setMostrarComentario] = useState(null);
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [calificacionTemp, setCalificacionTemp] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const visitante = JSON.parse(localStorage.getItem("visitante") || "null");
  const token = localStorage.getItem("token");
  const isVisitor = !!visitante && !token;


  const navigate = useNavigate();


  // Formularios
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '', descripcion: '', fecha: '', hora: '',
    lugar: '', organizador: '', imagen: null, imagenPreview: null
  });

  const [nuevoProveedor, setNuevoProveedor] = useState({
    categoria: '', descripcion: ''
  });

  const categorias = [
    'Electricista', 'Plomero', 'Jardinero', 'Limpieza', 'Pintor', 
    'Carpintero', 'Delivery', 'Mecánico', 'Veterinario', 'Otro'
  ];

  const abrirImagen = (url) => {
    setSelectedImage(url);
  };

  const cerrarImagen = () => {
    setSelectedImage(null);
  };


  // 🔹 Cargar proveedores y eventos desde la API
  useEffect(() => {
  const fetchData = async () => {
    try {
      const visitante = localStorage.getItem("visitante")
        ? JSON.parse(localStorage.getItem("visitante"))
        : null;

      const [resProveedores, resEventos] = await Promise.all([
        API.get("/api/proveedores", {
          headers: {
            city: visitante ? visitante.ciudad : null
          }
        }),
        API.get("/api/eventos", {
          headers: {
            city: visitante ? visitante.ciudad : null
          }
        })
      ]);

      setProveedores(resProveedores.data);
      setEventos(resEventos.data);
    } catch (err) {
      console.error("Error al cargar datos", err);
    }
  };
  fetchData();
}, []);


  // 🔹 Crear proveedor
  const agregarProveedor = async () => {
    if (!nuevoProveedor.categoria) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos obligatorios'
      });
      return;
    }

    try {
      const res = await API.post("/api/proveedores", {
        ...nuevoProveedor,
      });
      setProveedores([...proveedores, res.data]);
      setNuevoProveedor({ nombre: '', telefono: '', categoria: '', descripcion: '' });
      setMostrarFormulario(false);

      Swal.fire({
        icon: 'success',
        title: 'Proveedor agregado',
        text: '¡Proveedor agregado exitosamente!'
      }).then(() => {
        window.location.reload();
      });

    } catch (err) {
      console.error("Error al agregar proveedor", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al registrar el proveedor'
      });
    }
  };

  // 🔹 Crear evento
  const agregarEvento = async () => {
    if (!nuevoEvento.titulo || !nuevoEvento.fecha || !nuevoEvento.hora) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete título, fecha y hora'
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", nuevoEvento.titulo);
      formData.append("descripcion", nuevoEvento.descripcion);
      formData.append("fecha", nuevoEvento.fecha);
      formData.append("hora", nuevoEvento.hora);
      formData.append("lugar", nuevoEvento.lugar);
      formData.append("organizador", nuevoEvento.organizador);
      if (nuevoEvento.imagen) {
        formData.append("imagen", nuevoEvento.imagen);
      }

      const res = await API.post("/api/eventos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEventos([...eventos, res.data]);
      setNuevoEvento({
        titulo: "", descripcion: "", fecha: "", hora: "",
        lugar: "", organizador: "", imagen: null, imagenPreview: null
      });
      setMostrarEventoForm(false);

      Swal.fire({
        icon: 'success',
        title: 'Evento publicado',
        text: '¡Evento publicado exitosamente!'
      });

    } catch (err) {
      console.error("Error al agregar evento", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al publicar el evento'
      });
    }
  };


  // 🔹 Calificar proveedor
  const calificarProveedor = async (proveedorId, calificacion) => {
    if (comentarioTexto.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Comentario requerido',
        text: 'Por favor escriba un comentario sobre el servicio'
      });
      return;
    }

    try {
      const res = await API.post(`/api/proveedores/${proveedorId}/calificar`, {
        estrellas: calificacion,
        comentario: comentarioTexto,
      });

      Swal.fire({
        icon: 'success',
        title: '¡Gracias!',
        text: '¡Gracias por su calificación y comentario!'
      }).then(() => {
        window.location.reload();
      });

    } catch (err) {
      console.error("Error al calificar proveedor", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al enviar la calificación'
      });
    }
  };

  // 🔹 Funciones auxiliares
  const iniciarCalificacion = (proveedorId, calificacion) => {
    setCalificacionTemp(calificacion);
    setMostrarComentario(proveedorId);
  };

  const cancelarCalificacion = () => {
    setMostrarComentario(null);
    setComentarioTexto('');
    setCalificacionTemp(0);
  };

  const calcularPromedio = (calificaciones) => {
    if (!calificaciones || calificaciones.length === 0) return 0;
    const suma = calificaciones.reduce((sum, cal) => sum + cal.estrellas, 0);
    return (suma / calificaciones.length).toFixed(1);
  };

  const proveedoresFiltrados = proveedores.filter(p => {
    const matchCategoria = filtroCategoria === 'todos' || p.categoria === filtroCategoria;
    const matchBusqueda = (p.persona.nombres + " " + p.persona.apellidos).toLowerCase().includes(busqueda.toLowerCase()) ||
                         p.categoria.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  const eventosOrdenados = [...eventos].sort((a, b) => {
    const fechaA = new Date(a.fecha + ' ' + a.hora);
    const fechaB = new Date(b.fecha + ' ' + b.hora);
    return fechaA - fechaB;
  });

  const manejarImagenEvento = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevoEvento({
        ...nuevoEvento,
        imagen: file, // archivo real
        imagenPreview: URL.createObjectURL(file), // preview en frontend
      });
    }
  };


  const esEventoPasado = (fecha, hora) => {
    const ahora = new Date();
    const fechaEvento = new Date(`${fecha}T${hora}`);
    return fechaEvento < ahora;
  };

  // Formatea fecha con hora bonita
  const formatearFecha = (fecha, hora) => {
    const opciones = { year: "numeric", month: "long", day: "numeric" };
    const fechaFormateada = new Date(fecha).toLocaleDateString("es-ES", opciones);
    return `${fechaFormateada} - ${hora}`;
  };

  const eliminarImagenEvento = () => {
    setNuevoEvento({ ...nuevoEvento, imagen: null, imagenPreview: null });
  };

  const handleLogout = async () => {
    try {
      await axios.post(import.meta.env.VITE_API_URL +"/api/auth/logout", {
        token: localStorage.getItem("token")
      }); // opcional, si tu backend tiene este endpoint
    } catch (err) {
      console.warn("Error en logout", err);
    } finally {
      localStorage.removeItem("token"); // 👈 elimina token
      localStorage.removeItem("visitante"); // por si usas modo visitante
      navigate("/login"); // 👈 redirige
    }
  };

  // 🔹 Componente estrella
  const StarRating = ({ rating, onRate, readonly = false }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onRate && onRate(star)}
          disabled={readonly}
          className={`text-2xl ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${!readonly ? 'hover:text-yellow-300 cursor-pointer' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-blue-50 min-h-screen">
      <header className="bg-blue-600 text-white p-6 rounded-lg mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">🏘️ Pinares Servicios</h1>
          <p className="text-lg">Servicios y eventos del barrio</p>
        </div>
        {/* 🔹 Botón Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <LogOut size={20} /> Cerrar sesión
        </button>
      </header>

      {/* Navegación por pestañas */}
      <div className="flex bg-white rounded-lg shadow mb-6 overflow-hidden">
        <button
          onClick={() => setSeccionActiva('servicios')}
          className={`flex-1 py-4 px-6 text-lg font-semibold flex items-center justify-center gap-2 ${
            seccionActiva === 'servicios' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Phone size={20} />
          Servicios
        </button>
        <button
          onClick={() => setSeccionActiva('eventos')}
          className={`flex-1 py-4 px-6 text-lg font-semibold flex items-center justify-center gap-2 ${
            seccionActiva === 'eventos' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Calendar size={20} />
          Eventos
        </button>
      </div>

      {/* Botones principales */}
      {!isVisitor && <div className="flex flex-wrap gap-4 mb-6 justify-center">
        {seccionActiva === 'servicios' ? (
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className={`${mostrarFormulario ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-6 py-3 rounded-lg text-xl font-semibold flex items-center gap-2`}
          >
            {!mostrarFormulario ? <Plus size={24} /> : <X size={24} />}
            {mostrarFormulario ? 'Cancelar' : 'Agregar Proveedor'}
          </button>
        ) : (
          <button
            onClick={() => setMostrarEventoForm(!mostrarEventoForm)}
            className={`${mostrarEventoForm ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'} text-white px-6 py-3 rounded-lg text-xl font-semibold flex items-center gap-2`}
          >
            {!mostrarEventoForm ? <Plus size={24} /> : <X size={24} />}
            {mostrarEventoForm ? 'Cancelar' : 'Publicar Evento'}
          </button>
        )}
      </div>}
      

      {/* Formulario para agregar proveedor */}
      {mostrarFormulario && seccionActiva === 'servicios' && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Registrar Nuevo Proveedor</h2>
          <div className="p-4 border border-amber-400 bg-amber-100 text-amber-400 rounded-2xl font-bold mb-4">
            Estas a punto de registrarte como un proveedor
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-2">Tipo de Servicio *</label>
              <select
                value={nuevoProveedor.categoria}
                onChange={(e) => setNuevoProveedor({...nuevoProveedor, categoria: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg"
              >
                <option value="">Seleccionar servicio</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">Descripción (opcional)</label>
              <textarea
                value={nuevoProveedor.descripcion}
                onChange={(e) => setNuevoProveedor({...nuevoProveedor, descripcion: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg h-24"
                placeholder="Breve descripción del servicio"
              />
            </div>

            <button
              type="button"
              onClick={agregarProveedor}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-xl font-semibold"
            >
              Registrar Proveedor
            </button>
          </div>
        </div>
      )}

      {/* Formulario para agregar evento */}
      {mostrarEventoForm && seccionActiva === 'eventos' && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-600">Publicar Nuevo Evento</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold mb-2">Título del Evento *</label>
              <input
                type="text"
                value={nuevoEvento.titulo}
                onChange={(e) => setNuevoEvento({...nuevoEvento, titulo: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg"
                placeholder="Ej: Reunión de Vecinos"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-semibold mb-2">Fecha *</label>
                <input
                  type="date"
                  value={nuevoEvento.fecha}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, fecha: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg"
                />
              </div>
              
              <div>
                <label className="block text-lg font-semibold mb-2">Hora *</label>
                <input
                  type="time"
                  value={nuevoEvento.hora}
                  onChange={(e) => setNuevoEvento({...nuevoEvento, hora: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">Lugar</label>
              <input
                type="text"
                value={nuevoEvento.lugar}
                onChange={(e) => setNuevoEvento({...nuevoEvento, lugar: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg"
                placeholder="Ej: Plaza del barrio"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">Organizador</label>
              <input
                type="text"
                value={nuevoEvento.organizador}
                onChange={(e) => setNuevoEvento({...nuevoEvento, organizador: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg"
                placeholder="Su nombre o grupo organizador"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">Imagen del Evento</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={manejarImagenEvento}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-sm text-gray-600">Tamaño máximo: 2MB. Formatos: JPG, PNG, GIF</p>
                
                {nuevoEvento.imagenPreview && (
                  <div className="relative inline-block">
                    <img
                      src={nuevoEvento.imagenPreview}
                      alt="Vista previa"
                      className="w-48 h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={eliminarImagenEvento}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">Descripción</label>
              <textarea
                value={nuevoEvento.descripcion}
                onChange={(e) => setNuevoEvento({...nuevoEvento, descripcion: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg h-24"
                placeholder="Detalles del evento"
              />
            </div>

            <button
              type="button"
              onClick={agregarEvento}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg text-xl font-semibold"
            >
              Publicar Evento
            </button>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {seccionActiva === 'servicios' ? (
        <>
          {/* Filtros de búsqueda para servicios */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o servicio..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-10 p-3 border-2 border-gray-300 rounded-lg text-lg"
                  />
                </div>
              </div>
              
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="p-3 border-2 border-gray-300 rounded-lg text-lg"
              >
                <option value="todos">Todos los servicios</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de proveedores */}
          <div className="space-y-4">
            {proveedoresFiltrados.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xl text-gray-600">No se encontraron proveedores</p>
              </div>
            ) : (
              proveedoresFiltrados.map(proveedor => (
            <div key={proveedor.id} className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-64">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">{proveedor.persona.nombres} {proveedor.persona.apellidos}</h3>
                  <p className="text-lg text-gray-600 mb-1">
                    <span className="font-semibold">Servicio:</span> {proveedor.categoria}
                  </p>
                  {proveedor.descripcion && (
                    <p className="text-gray-600 mb-2">{proveedor.descripcion}</p>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={18} className="text-green-600" />
                    <a 
                      href={`tel:${proveedor.telefono}`}
                      className="text-lg font-semibold text-green-600 hover:text-green-700"
                    >
                      {proveedor.persona.telefono}
                    </a>
                  </div>
                  
                  {/* Calificación actual */}
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={Math.round(calcularPromedio(proveedor.calificaciones))} readonly={true} />
                    <span className="text-lg font-semibold">
                      {calcularPromedio(proveedor.calificaciones)} 
                      ({proveedor.calificaciones.length ?? 0} calificaciones)
                    </span>
                  </div>

                  {/* Comentarios de otros vecinos */}
                  {proveedor.calificaciones.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-semibold mb-2">💬 Comentarios de vecinos:</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {proveedor.calificaciones.slice(-3).reverse().map((cal, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-yellow-400">{'★'.repeat(cal.estrellas)}</span>
                              <span className="text-gray-500 text-xs">({cal.created_at.split("T")[0]})</span>
                            </div>
                            <p className="text-gray-700">"{cal.comentario}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Panel de calificación */}
                {!isVisitor && <div className="bg-gray-50 p-4 rounded-lg min-w-64">
                  {mostrarComentario === proveedor.id ? (
                    <div>
                      <p className="font-semibold mb-2 text-center">Calificar servicio</p>
                      <div className="flex justify-center mb-3">
                        <StarRating rating={calificacionTemp} readonly={true} />
                      </div>
                      <textarea
                        value={comentarioTexto}
                        onChange={(e) => setComentarioTexto(e.target.value)}
                        placeholder="Escriba su comentario sobre el servicio..."
                        className="w-full p-2 border border-gray-300 rounded text-sm h-20 mb-3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => calificarProveedor(proveedor.id, calificacionTemp)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded font-semibold"
                        >
                          Enviar
                        </button>
                        <button
                          onClick={cancelarCalificacion}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded font-semibold"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold mb-2 text-center">¿Usó este servicio?</p>
                      <p className="text-center mb-3">Califíquelo:</p>
                      <div className="flex justify-center">
                        <StarRating 
                          rating={0}
                          onRate={(rating) => iniciarCalificacion(proveedor.id, rating)}
                        />
                      </div>
                    </div>
                  )}
                </div>}
                
              </div>
            </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Sección de eventos */
        <div className="space-y-4">
          {eventosOrdenados.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">No hay eventos publicados</p>
            </div>
          ) : (
            eventosOrdenados.map(evento => (
              <div key={evento.id} className={`bg-white rounded-lg shadow-lg border-l-4 overflow-hidden ${
                esEventoPasado(evento.fecha, evento.hora) ? 'border-gray-400 opacity-75' : 'border-purple-500'
              }`}>
                {/* Imagen del evento */}
                {evento.imagen && (
                  <div className="w-full h-48 overflow-hidden cursor-pointer">
                    <img
                      src={evento.imagen}
                      alt={evento.titulo}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      onClick={() => abrirImagen(evento.imagen)}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-64">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-2xl font-bold ${
                          esEventoPasado(evento.fecha, evento.hora) ? 'text-gray-600' : 'text-purple-600'
                        }`}>
                          {evento.titulo}
                        </h3>
                        {esEventoPasado(evento.fecha, evento.hora) && (
                          <span className="bg-gray-500 text-white px-2 py-1 rounded text-sm">FINALIZADO</span>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-purple-500" size={18} />
                          <span className="text-lg font-semibold">
                            {formatearFecha(evento.fecha, evento.hora)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="text-purple-500" size={18} />
                          <span className="text-lg">
                            {evento.hora}
                          </span>
                        </div>
                        
                        {evento.lugar && (
                          <div className="flex items-center gap-2">
                            <MapPin className="text-purple-500" size={18} />
                            <span className="text-lg">
                              {evento.lugar}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {evento.descripcion && (
                        <p className="text-gray-700 mb-3 text-lg leading-relaxed">
                          {evento.descripcion}
                        </p>
                      )}
                      
                      {evento.organizador && (
                        <p className="text-gray-600 text-sm">
                          <strong>Organiza:</strong> {evento.organizador}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={cerrarImagen}
        >
          <img
            src={selectedImage}
            alt="Imagen ampliada"
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl hover:bg-red-700"
            onClick={cerrarImagen}
          >
            x
          </button>
        </div>
      )}

      
      {/* Footer */}
      <footer className="mt-8 text-center text-gray-600">
        <p>📱 Pinares Servicios - Hecho con ❤️ para nuestra comunidad</p>
      </footer>
    </div>
  );
};

export default HomePage;