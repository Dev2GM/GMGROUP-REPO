import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Buscador, { loader as BuscadorLoader } from "@/pages/BuscadorGeneral";
import AltaContacto, {
  loader as AltaContactoLoader,
} from "@/pages/AltaContacto";
import AltaPoliza from "@/pages/AltaPoliza";
import Layout from "@/layouts/MainLayout";
import CalendarInterface from "@/pages/Calendario";
import NucleoConocimiento from "@/pages/NucleoConocimiento";
import PreguntasFrecuentes from "@/pages/PreguntasFrecuentes";
import Kanban from "@/pages/Kanban";
import ProspeccionTerceros from "@/pages/ProspeccionTerceros";
import ConocimientoBot from "@/pages/ConocimientoBot";
import ManualesMateriales from "@/pages/ManualesMateriales";
import DetallesCliente from "@/pages/DetallesCliente";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Layout />, // layout general
    children: [
      {
        path: "buscador",
        element: <Buscador />,
        loader: BuscadorLoader,
      },
      {
        path: "alta-contacto",
        element: <AltaContacto />,
        loader: AltaContactoLoader,
      },
      {
        path: "detalles-cliente",
        element: <DetallesCliente />,
      },
      {
        path: "alta-poliza",
        element: <AltaPoliza />,
      },
      {
        path: "calendario",
        element: <CalendarInterface />,
      },
      {
        path: "kanban",
        element: <Kanban />,
      },
      {
        path: "prospeccion-terceros",
        element: <ProspeccionTerceros />,
      },
      {
        path: "chat",
        element: <p>CHAT</p>,
      },
      {
        path: "nucleo-conocimiento",
        element: <NucleoConocimiento />,
      },
      {
        path: "preguntas",
        element: <PreguntasFrecuentes />,
      },
      {
        path: "conocimiento-bot",
        element: <ConocimientoBot />,
      },
      {
        path: "manuales-materiales",
        element: <ManualesMateriales />,
      },
    ],
  },
  {
    path: "*",
    element: <Login />, // fallback
  },
]);
