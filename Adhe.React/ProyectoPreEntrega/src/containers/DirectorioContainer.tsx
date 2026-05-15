import React, { useEffect, useState } from "react";

import Directorio from "../components/contact/Directorio";
import { type Person } from "../models";

const DirectorioContainer: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    const controller: AbortController = new AbortController();
    const { signal } = controller;
    fetch("/data/nosotros.json", { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setPeople(data);
      })
      .catch((err: unknown) => {
        if ((err as Error)?.name === "AbortError") {
          return;
        }
        setError((err as Error)?.message ?? "Error cargando datos");
      })
      .finally(() => {
        setLoading(false);
      });

    return (): void => {
      controller.abort();
    };
  }, []);

  return <Directorio error={error} loading={loading} people={people} />;
};

export default DirectorioContainer;
