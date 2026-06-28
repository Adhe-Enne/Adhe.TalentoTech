import React from "react";

import styles from "./ToggleSwitch.module.css";

interface ToggleSwitchProps {
  checked: boolean;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = (props) => {
  const { checked, disabled, label, loading, onToggle } = props;
  const isDisabled: boolean = disabled === true || loading === true;

  return (
    <button
      aria-busy={loading}
      aria-checked={checked}
      aria-disabled={isDisabled}
      aria-label={label}
      className={`${styles.track} ${loading ? styles.loading : ""}`}
      data-checked={checked}
      disabled={isDisabled}
      onClick={onToggle}
      role="switch"
      type="button"
    >
      {loading ? <span className={styles.spinner} /> : <span className={styles.knob} data-checked={checked} />}
    </button>
  );
};

export default ToggleSwitch;
