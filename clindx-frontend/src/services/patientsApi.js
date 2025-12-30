export async function fetchPatients(token) {
    const res = await fetch("http://localhost:3000/api/v1/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) throw new Error("Failed to fetch patients");
    return res.json();
  }
  