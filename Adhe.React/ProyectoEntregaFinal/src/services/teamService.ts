import { collection, getDocs, query, orderBy, type DocumentData, Query, QuerySnapshot, CollectionReference } from "firebase/firestore";

import type { Person } from "../models";

import { TEAM_COLLECTION } from "../App.Constants";
import { db } from "../firebase";
import { mapTimestamps } from "../utils/parseDataUtils";

function mapDocToPerson(docData: DocumentData, id: string): Person {
  const data: DocumentData = docData;
  return {
    id,
    name: data.nombre ?? data.name ?? data.fullName ?? "Sin nombre",
    position: data.rol ?? data.position ?? data.puesto,
    email: data.linkedinEmail ?? data.email ?? data.correo,
    photo: data.fotoURL ?? data.foto ?? data.photoUrl,
    linkedin: data.linkedinURL ?? data.linkedin ?? data.linkedinUrl,
    bio: data.bio ?? data.biography ?? data.descripcion,
    order: data.order,
    ...mapTimestamps(data),
  };
}

export const teamService: {
  fetchTeam: () => Promise<Person[]>;
} = {
  fetchTeam: async (): Promise<Person[]> => {
    const colRef: CollectionReference = collection(db, TEAM_COLLECTION);
    const q: Query<DocumentData> = query(colRef, orderBy("order", "asc"));
    const snap: QuerySnapshot<DocumentData> = await getDocs(q);
    return snap.docs.map((d) => mapDocToPerson(d.data(), d.id));
  },
};
