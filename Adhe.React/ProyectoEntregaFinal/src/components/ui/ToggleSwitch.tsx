import React from "react";

import styles from "./ToggleSwitch.module.css";

interface ToggleSwitchProps {
  checked: boolean;
  label: string;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = (props) => {
  const { checked, label, onToggle } = props;

  return (
    <button aria-checked={checked} aria-label={label} className={styles.track} data-checked={checked} onClick={onToggle} role="switch" type="button">
      <span className={styles.knob} />
    </button>
  );
};

export default ToggleSwitch;
