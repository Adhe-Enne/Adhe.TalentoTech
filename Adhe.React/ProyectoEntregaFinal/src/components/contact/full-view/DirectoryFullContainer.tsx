import { collection, CollectionReference, getDocs, QuerySnapshot, type DocumentData, query, orderBy, Query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { db } from "../../../firebase";
import { type Person } from "../../../models";
import { TEAM_COLLECTION } from "../../../App.Constants";
import DirectoryFullView from "./DirectoryFullView";

const DirectoryFullContainer: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    let mounted: boolean = true;

    const fetchAll: () => Promise<void> = async (): Promise<void> => {
      try {
        setLoading(true);
        const colRef: CollectionReference = collection(db, TEAM_COLLECTION);
        const q: Query<DocumentData> = query(colRef, orderBy("order", "asc"));
        const snap: QuerySnapshot<DocumentData> = await getDocs(q);

        const mapped: Person[] = snap.docs.map((doc) => {
          const data: DocumentData = doc.data();
          const name: string = data.nombre ?? data.name ?? data.fullName ?? "Sin nombre";
          const position: string | undefined = data.rol ?? data.position ?? data.puesto;
          const email: string | undefined = data.linkedinEmail ?? data.email ?? data.correo ?? undefined;
          const photo: string | undefined = data.fotoURL ?? data.foto ?? data.photoUrl ?? undefined;
          const linkedin: string | undefined = data.linkedinURL ?? data.linkedin ?? data.linkedinUrl ?? undefined;
          const bio: string | undefined = data.bio ?? data.biography ?? data.descripcion ?? undefined;
          return {
            id: doc.id,
            name,
            position,
            email,
            photo,
            linkedin,
            bio,
          };
        });

        if (mounted) {
          setPeople(mapped);
        }
      } catch (err: unknown) {
        if (mounted) {
          setError((err as Error)?.message ?? "Error cargando datos");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchAll();

    return (): void => {
      mounted = false;
    };
  }, []);

  return <DirectoryFullView error={error} loading={loading} people={people} />;
};

export default DirectoryFullContainer;
