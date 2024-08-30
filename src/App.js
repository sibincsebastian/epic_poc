import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FetchButton from "./FetchButton";
import Callback from "./Callback";
import PatientPage from "./PatientPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FetchButton />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/patient/:patientId" element={<PatientPage />} />
      </Routes>
    </Router>
  );
}

export default App;
