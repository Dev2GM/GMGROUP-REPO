import {
  Users,
  Home,
  UserPlus,
  FilePlus,
  MessageSquare,
  Calendar,
  Table,
  MessageCircle,
  Briefcase
} from "lucide-react";

const items = [
  {
    path: "/login",
    icon: <Users size={20} />,
    label: "Login",
  },
  {
    path: "/buscador",
    icon: <Home size={20} />,
    label: "Inicio",
  },
  // Quitar este cuando se despliegue
  {
    path: "/detalles-cliente",
    icon: <Home size={20} />,
    label: "Informacion de cliente",
  },
  {
    path: "/alta-contacto",
    icon: <UserPlus size={20} />,
    label: "Alta de contacto",
  },
  {
    path: "/alta-poliza",
    icon: <FilePlus size={20} />,
    label: "Alta de póliza",
  },
  {
    path: "/chat",
    icon: <MessageSquare size={20} />,
    label: "Chat",
  },
  {
    path: "/calendario",
    icon: <Calendar size={20} />,
    label: "Calendario",
  },
  {
    path: "/kanban",
    icon: <Table size={20} />,
    label: "Kanban",
  },
  {
    path: "/prospeccion-terceros",
    icon: <Briefcase size={20} />,
    label: "Prospección de terceros",
  },
  {
    path: "/nucleo_conocimiento",
    icon: <MessageCircle size={20} />,
    label: "Núcleo de conocimiento",
  },
];

export default items;
