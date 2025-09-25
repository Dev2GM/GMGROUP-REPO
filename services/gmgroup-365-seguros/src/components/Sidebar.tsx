import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import items from "@/constants/Sidebar";

import { LogOut, Edit, MoreVertical, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
    setShowUserOptions(false);
  };

  const toggleUserOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUserOptions(!showUserOptions);
  };

  return (
    <div
      className={`${
        expanded ? "w-64" : "w-16"
      } bg-principal flex flex-col h-screen sticky top-0 transition-all duration-300`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo */}
      <div className="flex justify-center p-4">
        {expanded ? (
          <img src="/logo.svg" alt="Logo completo de +365 seguros" />
        ) : (
          <img src="/logo_reducido.svg" alt="Logo reducido de +365 seguros" />
        )}
      </div>

      {/* Enlaces de navegación */}
      <div className="flex-1 overflow-y-auto text-white scrollbar-thin">
        <div className="flex flex-col px-2">
          {items.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex items-center p-3 my-1 rounded-md transition-all duration-200 relative
                  ${
                    isActive
                      ? "bg-secundario/80 text-gris border-l-4 border-gris font-semibold"
                      : "hover:text-gris hover:bg-secundario/80 transition-colors"
                  }
                `}
              >
                <div
                  className={`flex justify-center transition-colors duration-200 ${
                    isActive ? "text-gris" : ""
                  }`}
                >
                  {link.icon}
                </div>

                {expanded && (
                  <span
                    className={`ml-3 text-sm font-medium whitespace-nowrap overflow-hidden text-left transition-colors duration-200`}
                  >
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        /* Personalizar la barra de desplazamiento */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Perfil de usuario */}
      <div className="border-t border-principal text-white p-2 relative">
        <div className="flex items-center p-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
            <User size={24} color="#FFF" />
          </div>

          {expanded && (
            <>
              <span className="ml-3 text-sm font-medium flex-1">Zona 3</span>
              <Button
                onClick={toggleUserOptions}
                variant="ghost"
                size="icon"
                className="text-white"
              >
                <MoreVertical size={20} />
              </Button>
            </>
          )}
        </div>

        {/* Menú desplegable de usuario */}
        {expanded && showUserOptions && (
          <div className="absolute bottom-14 right-2 bg-principal text-white shadow-lg rounded-md py-1 w-36 z-10">
            <Button
              variant="ghost"
              size="default"
              className="w-full"
              onClick={async () => {
                navigate("/login")
                await logout();
              }}
            >
              <LogOut size={16} className="mr-2" />
              Salir
            </Button>
            <Button
              variant="ghost"
              size="default"
              className="w-full"
            >
              <Edit size={16} className="mr-2" />
              Editar perfil
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
