import React from "react";

const PatientSelector = ({ patients, selectedPatient, onSelect }) => {
  return (
    <div className="card">
      <h3>Select Patient</h3>

      <select
        value={selectedPatient || ""}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">-- Choose Patient --</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} (#{p.id})
          </option>
        ))}
      </select>
    </div>
  );
};

export default PatientSelector;
