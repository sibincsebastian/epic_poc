import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.css";

function Callback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [extractedCode, setExtractedCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [error, setError] = useState(null);

  const patientIds = [
    "e0w0LEDCYtfckT6N.CkJKCw3",
    "eh2xYHuzl9nkSFVvV3osUHg3",
    "eIXesllypH3M9tAA5WdJftQ3",
    "egqBHVfQlt4Bw3XGXoxVxHg3",
    "eAB3mDIBBcyUKviyzrxsnAw3",
    "erXuFYUfucBZaryVksYEcMg3",
  ];

  useEffect(() => {
    const validateAccessToken = async (token) => {
      try {
        // Attempt to fetch patient data with the stored token to validate it
        const testPatientId = patientIds[0];
        const patientUrl = `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/${testPatientId}`;
        const response = await fetch(patientUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.ok) {
          // Token is valid, fetch the patient data
          setAccessToken(token);
          fetchPatientData(token);
        } else {
          // Token is invalid or expired, clear it and fetch a new one
          console.log(
            "Stored access token is invalid. Fetching a new token..."
          );
          localStorage.removeItem("fhirAccessToken");
          fetchNewAccessToken();
        }
      } catch (error) {
        console.error("Error validating access token:", error);
        setError("Failed to validate access token. Please try again.");
      }
    };

    const fetchNewAccessToken = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      setExtractedCode(code);

      if (code) {
        const tokenEndpoint =
          "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token";
        const clientId = "bc0b0787-665e-4484-97a2-c9ad07044382";
        const clientSecret =
          "BUEzTpp1tU1BEyO82ojYAw3jNSznR2Zgur9goDtLZs25tQRwu+c0ctYhg6jLfZdNCyZSLJyH4rmOM9Az2vCRkA==";
        const redirectUri = "https://localhost:3000/callback";

        try {
          const response = await fetch(tokenEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: redirectUri,
              client_id: clientId,
              client_secret: clientSecret,
            }),
          });

          if (!response.ok) {
            throw new Error(
              `Network response was not ok: ${response.statusText}`
            );
          }

          const data = await response.json();
          setAccessToken(data.access_token);
          console.log("Fetched Access Token:", data.access_token);
          localStorage.setItem("fhirAccessToken", data.access_token);
          console.log("Stored Access Token:", data.access_token);
          fetchPatientData(data.access_token);
        } catch (error) {
          console.error("Error fetching access token:", error);
          setError("Failed to obtain access token.");
        }
      } else {
        console.error("Authorization code is missing.");
        setError("Authorization code is missing. Please try logging in again.");
      }
    };

    // Check if there's a stored access token
    const storedAccessToken = localStorage.getItem("fhirAccessToken");
    if (storedAccessToken) {
      // Validate the stored token
      console.log("Validating stored access token...");
      validateAccessToken(storedAccessToken);
    } else {
      // No stored token, fetch a new one
      fetchNewAccessToken();
    }
  }, [location]);

  const fetchPatientData = async (accessToken) => {
    const patientPromises = patientIds.map(async (patientId) => {
      const patientUrl = `https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/Patient/${patientId}`;
      try {
        const response = await fetch(patientUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Network response was not ok for patient ${patientId}: ${response.statusText}`
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Error fetching patient data for ${patientId}:`, error);
        return null; // Or handle errors as needed
      }
    });

    try {
      const fetchedData = await Promise.all(patientPromises);
      setPatientData(fetchedData.filter((data) => data !== null));
      console.log(`Patient Data:`, fetchedData);
    } catch (error) {
      console.error("Error fetching patient data:", error);
      setError("Failed to fetch patient data. Please try again.");
    }
  };

  return (
    <div>
      {extractedCode || accessToken ? (
        <div>
          <div className="table-heading">
            <h2>Patients</h2>
          </div>
          {error && <p className="error">{error}</p>}
          {patientData.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>DOB</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {patientData.map((patient, index) => (
                    <tr key={index}>
                      <td>
                        <Link
                          to={`/patient/${patient.id}`}
                          state={{ patient: patient, accessToken: accessToken }}
                        >
                          {patient.name && patient.name[0].text}
                        </Link>
                      </td>
                      <td>{patient.birthDate}</td>
                      <td>
                        {patient.telecom &&
                          patient.telecom.find(
                            (telecom) => telecom.system === "email"
                          )?.value}
                      </td>
                      <td>
                        {patient.address &&
                          patient.address.length > 0 &&
                          `${patient.address[0].line[0]}, ${patient.address[0].city}, ${patient.address[0].state}, ${patient.address[0].postalCode}`}
                      </td>
                      <td>
                        {patient.telecom &&
                          patient.telecom.find(
                            (telecom) => telecom.system === "phone"
                          )?.value}
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
      ) : (
        <div class="loader"></div>
      )}
    </div>
  );
}

export default Callback;
