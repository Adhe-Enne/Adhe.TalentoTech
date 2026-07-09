import React, { type RefObject } from "react";
import { FaEnvelope, FaLinkedin } from "react-icons/fa";

import type { Person } from "../../../models";

import { DEFAULT_AVATAR_URL } from "../../../App.Constants";
import HelmetMeta from "../../ui/HelmetMeta";
import LoadingSpinner from "../../ui/LoadingSpinner";

interface TeamFullViewContentProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  error: string | null;
  loading: boolean;
  selected: Person | null;
  showModal: boolean;
  team: Person[];
  onClose: () => void;
  onShowMore: (p: Person) => void;
}

const TeamFullViewContent: React.FC<TeamFullViewContentProps> = (props) => {
  const { dialogRef, error, loading, onClose, onShowMore, selected, showModal, team } = props;

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
    <>
      <HelmetMeta description="Conoce a nuestro equipo en Talento Tech." title="Talento Tech | Equipo" />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 text-center">Equipo completo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((p) => {
            const { name, position, email, linkedin, bio, photo } = p;
            return (
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 group" key={p.id}>
                <div className="bg-gradient-to-br from-brand/5 via-accent/5 to-cta/5 px-6 pt-8 pb-4">
                  <img alt={name} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg mx-auto group-hover:scale-105 transition-transform duration-300" src={photo ?? DEFAULT_AVATAR_URL} />
                </div>
                <div className="px-6 pb-6">
                  <h3 className="text-lg font-bold text-gray-900 text-center leading-snug">{name}</h3>
                  {position && (
                    <div className="flex justify-center mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand">
                        {position}
                      </span>
                    </div>
                  )}
                  {bio && (
                    <p className="text-sm text-gray-500 leading-relaxed mt-3 text-center line-clamp-3">{bio}</p>
                  )}
                  <div className="border-t border-gray-100 mt-4 pt-4 flex justify-center flex-wrap gap-2">
                    {bio && (
                      <button aria-label={`Ver más bio de ${name}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200" onClick={() => onShowMore(p)} type="button">
                        Ver más
                      </button>
                    )}
                    {email && (
                      <a aria-label={`Email de ${name}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-brand/20 text-brand hover:bg-brand/5 hover:border-brand/40 transition-all duration-200" href={`mailto:${email}`}>
                        <FaEnvelope aria-hidden="true" />
                        Email
                      </a>
                    )}
                    {linkedin && (
                      <a aria-label={`LinkedIn de ${name}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-accent/20 text-accent hover:bg-accent/5 hover:border-accent/40 transition-all duration-200" href={linkedin} rel="noopener noreferrer" target="_blank">
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

        {selected && showModal && (
            <dialog aria-modal="true" className="fixed inset-0 m-0 w-full h-full max-w-none max-h-none bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-[2147483647] outline-none place-items-center animate-fade-in" onClose={onClose} ref={dialogRef}>
              <div className="bg-white rounded-2xl max-w-[720px] w-[min(92%,720px)] shadow-2xl relative max-h-[calc(100vh-120px)] overflow-auto animate-zoom-in">
                <div className="bg-gradient-to-br from-brand/5 via-accent/5 to-cta/5 px-8 pt-8 pb-4">
                  <img alt={selected.name} className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white shadow-lg mx-auto" src={selected.photo ?? DEFAULT_AVATAR_URL} />
                </div>
                <div className="px-8 pb-8">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">{selected.name}</h4>
                      {selected.position && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand mt-2">
                          {selected.position}
                        </span>
                      )}
                    </div>
                    <button aria-label="Cerrar modal" className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200" onClick={onClose} type="button">
                      <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="mt-4 text-sm leading-relaxed text-gray-600">
                    {selected.bio ? <p>{selected.bio}</p> : <p className="text-gray-400 italic">Sin biografía disponible.</p>}
                  </div>
                  <div className="border-t border-gray-100 mt-6 pt-4 flex flex-wrap gap-2">
                    {selected.email && (
                      <a aria-label={`Email de ${selected.name}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-brand/20 text-brand hover:bg-brand/5 hover:border-brand/40 transition-all duration-200" href={`mailto:${selected.email}`}>
                        <FaEnvelope aria-hidden="true" />
                        Email
                      </a>
                    )}
                    {selected.linkedin && (
                      <a aria-label={`LinkedIn de ${selected.name}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-accent/20 text-accent hover:bg-accent/5 hover:border-accent/40 transition-all duration-200" href={selected.linkedin} rel="noopener noreferrer" target="_blank">
                        <FaLinkedin aria-hidden="true" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </dialog>
        )}
      </div>
    </>
  );
};

export default TeamFullViewContent;
