import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from './config';

function App() {
  const [detections, setDetections] = useState([]);
  const [selectedDetection, setSelectedDetection] = useState(null);

  useEffect(() => {
    console.log("Fetching detections");
    axios.get(`${config.apiUrl}/detections`)
      .then(response => {
        console.log("Detections fetched:", response.data);
        setDetections(response.data);
      })
      .catch(error => {
        console.error('Error fetching detections:', error);
      });
  }, []);

  const handleValidate = (id, isValid) => {
    axios.post(`${config.apiUrl}/validate`, { id, is_valid: isValid })
      .then(() => {
        console.log(`Validated detection ${id}: ${isValid}`);
        setDetections(detections.map(d => d.id === id ? { ...d, is_valid: isValid } : d));
      })
      .catch(error => {
        console.error('Error validating detection:', error);
      });
  };

  const handleReclassify = (id, newClassId) => {
    axios.post(`${config.apiUrl}/reclassify`, { id, new_class_id: newClassId })
      .then(() => {
        console.log(`Reclassified detection ${id} to ${newClassId}`);
        setDetections(detections.map(d => d.id === id ? { ...d, class_id: newClassId } : d));
      })
      .catch(error => {
        console.error('Error reclassifying detection:', error);
      });
  };

  return (
    <div className="App">
      <h1>Object Detection Validation</h1>
      <div className="detection-list">
        {detections.map(detection => (
          <div key={detection.id} className="detection-item">
            <img src={`${config.apiUrl}/image/${detection.image_filename}`} alt="detection" />
            <div>Class: {detection.class_id}</div>
            <button onClick={() => handleValidate(detection.id, true)}>Validate</button>
            <button onClick={() => handleValidate(detection.id, false)}>Invalidate</button>
            <button onClick={() => setSelectedDetection(detection)}>Reclassify</button>
          </div>
        ))}
      </div>
      {selectedDetection && (
        <div className="reclassification-modal">
          <h2>Reclassify Detection</h2>
          <div>Current Class: {selectedDetection.class_id}</div>
          <input
            type="text"
            placeholder="New Class ID"
            onChange={(e) => handleReclassify(selectedDetection.id, e.target.value)}
          />
          <button onClick={() => setSelectedDetection(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
