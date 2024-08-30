const express = require("express");
const cors = require("cors");
const request = require("request");
const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

app.get("/authorize", (req, res) => {
  const authorizationUrl =
    "https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize?response_type=code&redirect_uri=https://localhost:3000/callback&client_id=bc0b0787-665e-4484-97a2-c9ad07044382&state=1234567&aud=https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4&scope=Patient.Read+Patient.Search+CarePlan.Read+CarePlan.Search";

  request(authorizationUrl, (error, response, body) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.redirect(authorizationUrl);
    }
  });
});

app.post("/Login", (req, res) => {
  // Add your logic here to handle the login request
  res.send("Login route is working!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
