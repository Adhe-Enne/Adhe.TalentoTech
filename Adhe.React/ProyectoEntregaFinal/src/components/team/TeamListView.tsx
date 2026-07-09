import React from "react";
import { FaArrowRight, FaEnvelope, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

import type { Person } from "../../models";

import { DEFAULT_AVATAR_URL } from "../../App.Constants";
import LoadingSpinner from "../ui/LoadingSpinner";

interface TeamListViewProps {
  error: string | null;
  loading: boolean;
  team: Person[];
}

const TeamListView: React.FC<TeamListViewProps> = (props) => {
  const { error, loading, team } = props;
  const limitedTeam: Person[] = team.slice(0, 6);

  if (loading) {
    return <LoadingSpinner message="Cargando equipo..." />;
  }
  if (error) {
    return (
      <div aria-live="assertive" className="text-muted italic" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl mb-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Equipo</h3>
        <Link aria-label="Ver todo el equipo" className="text-sm font-medium text-brand hover:text-brand/80 transition-colors duration-200 inline-flex items-center gap-1.5" to="/equipo">
          Ver todos
          <FaArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
        {limitedTeam.map((p) => {
          const { name: nombre, position: puesto, email, photo, linkedin } = p;
          return (
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-4 transition-all duration-200 group" key={p.id}>
              <div className="flex items-center gap-4">
                <img alt={nombre} className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:ring-brand/20 transition-all duration-200 shrink-0" src={photo ?? DEFAULT_AVATAR_URL} />
                <div className="min-w-0">
                  <h5 className="text-sm font-semibold text-gray-900 leading-tight truncate">{nombre}</h5>
                  <p className="text-xs font-medium text-brand mt-0.5 truncate">{puesto}</p>
                  {email && (
                    <a aria-label={`Email de ${nombre}`} className="text-xs text-gray-500 hover:text-brand transition-colors duration-200 inline-flex items-center gap-1 mt-1" href={`mailto:${email}`}>
                      <FaEnvelope aria-hidden="true" />
                      <span className="truncate">{email}</span>
                    </a>
                  )}
                  {linkedin && (
                    <a
                      aria-label={`LinkedIn de ${nombre}`}
                      className="text-xs text-gray-500 hover:text-[#0A66C2] transition-colors duration-200 inline-flex items-center gap-1 mt-0.5"
                      href={linkedin}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <FaLinkedin aria-hidden="true" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamListView;
