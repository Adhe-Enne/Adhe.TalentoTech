import React, { useCallback, useEffect, useState, type RefObject } from "react";

import type { Person } from "../../../models";

import useTeam from "../../../hooks/selectors/useTeam";
import { useDialog } from "../../../hooks/useDialog";
import TeamFullViewView from "./TeamFullViewView";

const TeamFullView: React.FC = () => {
  const { error, loading, team } = useTeam();
  const [selected, setSelected] = useState<Person | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const dialogRef: RefObject<HTMLDialogElement | null> = useDialog(showModal);

  const handleClose: () => void = useCallback((): void => {
    setShowModal(false);
    setSelected(null);
  }, []);

  const handleShowMore: (p: Person) => void = useCallback((p: Person): void => {
    setSelected(p);
    setShowModal(true);
  }, []);

  useEffect((): (() => void) => {
    const dialog: HTMLDialogElement | null = dialogRef.current;
    if (!dialog) {
      return (): void => undefined;
    }
    const onKey: (e: KeyboardEvent) => void = (e: KeyboardEvent): void => {
      if (e.key === "Enter") {
        handleClose();
      }
    };
    dialog.addEventListener("keydown", onKey);
    return (): void => dialog.removeEventListener("keydown", onKey);
  }, [dialogRef, handleClose]);

  return <TeamFullViewView dialogRef={dialogRef} error={error} loading={loading} onClose={handleClose} onShowMore={handleShowMore} selected={selected} showModal={showModal} team={team} />;
};

export default TeamFullView;
