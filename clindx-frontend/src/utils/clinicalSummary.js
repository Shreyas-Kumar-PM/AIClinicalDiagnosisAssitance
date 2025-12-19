export function generateClinicalSummary(result) {
    if (!result) return "";
  
    const risk =
      result.risk_score >= 0.8
        ? "high"
        : result.risk_score >= 0.4
        ? "moderate"
        : "low";
  
    const symptomsText = result.input_symptoms
      ? result.input_symptoms.slice(0, 3).join(", ")
      : "reported symptoms";
  
    return `
  Patient presents with ${symptomsText}.
  Model analysis suggests ${result.primary_diagnosis.toLowerCase()}.
  Overall clinical risk is assessed as ${risk}.
  `.trim();
  }
  