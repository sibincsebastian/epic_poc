import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./PatientPage.css";

function PatientPage() {
  const { patientId } = useParams();
  const location = useLocation();

  const [conditions, setConditions] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [medicationRequests, setMedicationRequests] = useState([]);
  const [error, setError] = useState(null);

  const accessToken = location.state?.accessToken;

  useEffect(() => {
    if (accessToken && patientId) {
      fetchData("Condition", setConditions);
      fetchData("AllergyIntolerance", setAllergies);
      fetchData("MedicationRequest", setMedicationRequests);
    }
  }, [accessToken, patientId]);

  const fetchData = async (resourceType, setState) => {
    const url = `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/${resourceType}?patient=${patientId}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error fetching ${resourceType}: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Check if the fetched resource is OperationOutcome
      if (data.resourceType === "OperationOutcome") {
        setState([{ text: "No data" }]);
      } else {
        const resources = data.entry
          ? data.entry.map((entry) => entry.resource)
          : [{ text: "No data" }];
        setState(resources);
        console.log(`${resourceType} Data:`, resources);
      }
    } catch (error) {
      console.error(`Error fetching ${resourceType}:`, error);
      setError(`Failed to fetch ${resourceType}. Please try again.`);
      setState([{ text: "No data" }]); // Set state to [{ text: "No data" }] on error
    }
  };

  const maxRows = Math.max(
    conditions.length,
    allergies.length,
    medicationRequests.length
  );

  return (
    <div>
      <div className="table-heading">
        <h1>Clinical Information</h1>
      </div>

      {error && <p className="error">{error}</p>}
      {maxRows > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Condition</th>
                <th>Allergy</th>
                <th>Medication Request</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxRows }).map((_, index) => (
                <tr key={index}>
                  <td>
                    {conditions[index]?.code?.text ||
                      conditions[index]?.text ||
                      "No data"}
                  </td>
                  <td>
                    {allergies[index]?.code?.text ||
                      allergies[index]?.text ||
                      "No data"}
                  </td>
                  <td>
                    {medicationRequests[index]?.medicationReference?.display ||
                      medicationRequests[index]?.text ||
                      "No data"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div class="loader"></div>
      )}
    </div>
  );
}

export default PatientPage;
