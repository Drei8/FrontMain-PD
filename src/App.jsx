import React, { useState, useRef, useEffect } from 'react'; // Add useEffect if not already there
import './App.css';
import Webcam from 'react-webcam';

// Define the steps constant
const CAPTURE_STEPS = ['front', 'side', 'analyzing', 'output'];

function App() {
  const videoConstraints = { /* ... */ };
  const webcamRef = useRef(null);

  // --- Existing State ---
  const [measurements, setMeasurements] = useState({ /* ... initial '---' ... */ });
  const [sizes, setSizes] = useState({ /* ... initial '---' ... */ });
  const [selectedMenu, setSelectedMenu] = useState('Home');
  const [showCameraPermission, setShowCameraPermission] = useState(false);
  // const [showInformation, setShowInformation] = useState(false); // <-- Can likely remove if not used in new flow
  // const [showSnapshotPopUp, setShowSnapshotPopUp] = useState(false); // <-- Remove this, replaced by new flow

  // --- State for Multi-Step Process ---
  const [captureStep, setCaptureStep] = useState(CAPTURE_STEPS[0]); // 'front' initially
  const [frontSnapshot, setFrontSnapshot] = useState(null); // Keep this for front image (base64)
  const [sideSnapshot, setSideSnapshot] = useState(null);   // For side image (base64)
  const [isLoading, setIsLoading] = useState(false);         // For loading modal
  // --- End New State ---


  // --- Existing Functions (handleMenuClick, handleCardClick) ---
  const handleMenuClick = (menuItem) => {
    if (menuItem === 'Get Measurements') {
      // Reset capture process state when navigating TO Get Measurements
      setShowCameraPermission(true); // Start with permission check again
      setCaptureStep(CAPTURE_STEPS[0]);
      setFrontSnapshot(null);
      setSideSnapshot(null);
      setMeasurements({ chest: '---', shoulder: '---', hip: '---', thigh: '---' });
      setSizes({ us: '---', uk: '---', asian: '---' });
      setIsLoading(false);
    }
    setSelectedMenu(menuItem);
  };

   const handlePopUpClick = (popUpName) => {
    if (popUpName === 'camera') {
      setShowCameraPermission(true);
      // setShowInformation(false); // Remove if not needed
    }
    if (popUpName === 'closeCamera') {
      setShowCameraPermission(false);
      // setShowInformation(true); // Remove if not needed
      // Start the capture process
      setCaptureStep(CAPTURE_STEPS[0]);
    }
    // if (popUpName === 'closeInformation') { // Remove if not needed
    //   setShowInformation(false);
    // }
  };

  const handleCardClick = (cardName) => {
    // Reuse handleMenuClick logic to trigger state reset if navigating to Measurements
    handleMenuClick(cardName);
  };
  // --- End Existing Functions ---


  // --- Modified handleSnapshot Function ---
  const handleSnapshot = () => {
    if (!webcamRef.current) {
      console.error("Webcam ref not available.");
      return;
    }
    const imageSrcDataUrl = webcamRef.current.getScreenshot();
     if (!imageSrcDataUrl) {
       console.error("Failed to get screenshot.");
       return;
    }

    const base64Image = imageSrcDataUrl.split(',')[1];

    // Logic based on current step
    if (captureStep === 'front') {
      console.log("Capturing Front View Snapshot...");
      setFrontSnapshot(base64Image);
      setCaptureStep(CAPTURE_STEPS[1]); // Move to 'side'
    }
    else if (captureStep === 'side') {
      console.log("Capturing Side View Snapshot...");
      setSideSnapshot(base64Image);
      setCaptureStep(CAPTURE_STEPS[2]); // Move to 'analyzing'
      setIsLoading(true);               // Show loading modal

      // Simulate analysis delay
      setTimeout(() => {
        console.log("Analysis complete. Setting measurements.");
        // Set dummy/actual results
        setMeasurements({
          chest: '38 in', shoulder: '16 in', hip: '40 in', thigh: '22 in',
        });
        setSizes({
          us: 'M', uk: 'M', asian: 'L',
        });
        // Move to final step
        setIsLoading(false);            // Hide loading modal
        setCaptureStep(CAPTURE_STEPS[3]); // Move to 'output'
      }, 3000); // 3-second delay
    }
  };
  // --- End Modified handleSnapshot ---


  // --- Helper Functions for Button State ---
  const getButtonText = () => {
    if (captureStep === 'front') return 'Take Front Snapshot';
    if (captureStep === 'side') return 'Take Side Snapshot';
    return 'Processing...'; // Button shouldn't be clickable here anyway
  };

  const isButtonDisabled = () => {
    return captureStep === 'analyzing' || captureStep === 'output';
  };

  // --- Reset Function ---
  const resetCaptureProcess = () => {
      setCaptureStep(CAPTURE_STEPS[0]);
      setFrontSnapshot(null);
      setSideSnapshot(null);
      setMeasurements({ chest: '---', shoulder: '---', hip: '---', thigh: '---' });
      setSizes({ us: '---', uk: '---', asian: '---' });
      setIsLoading(false);
  }
  // --- End Helper Functions ---

  return (
    <div className="app-container">
      {/* Menu */}
      <div className="menu-container">
         {/* ... Menu list items remain the same ... */}
         <ul>
          <li
            className={selectedMenu === 'Home' ? 'active' : ''}
            onClick={() => handleMenuClick('Home')}
          >
            Home
          </li>
          <li
            className={selectedMenu === 'Get Measurements' ? 'active' : ''}
            onClick={() => handleMenuClick('Get Measurements')}
          >
            Get Measurements
          </li>
          <li
            className={selectedMenu === 'Try On' ? 'active' : ''}
            onClick={() => handleMenuClick('Try On')}
          >
            Try On
          </li>
          <li
            className={selectedMenu === 'Closet' ? 'active' : ''}
            onClick={() => handleMenuClick('Closet')}
          >
            Closet
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="content-container">
        {/* Home Section */}
        {selectedMenu === 'Home' && (
            // ... Home Section JSX remains the same ...
            <>
            <h2 className="page-title">Pixle Fit</h2>
            <div className="card-grid">
              {/* Card 1 */}
              <div
                className="measurement-card"
                onClick={() => handleCardClick('Get Measurements')}
              >
                <h4 className="card-title">Auto Measurements</h4>
                <img
                  src="/src/assets/Untitled.png"
                  alt="MeasurementPNG"
                  className="card-img"
                />
                <div className="card-text">
                  <p>
                    Get your measurements and map them to their corresponding standard sizes across Asian,
                    European, and American sizing systems using advanced deep learning algorithms.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="measurement-card"
                onClick={() => handleCardClick('Try On')}
              >
                <h4 className="card-title">Virtual Try On</h4>
                <img
                  src="/src/assets/virtualtryonclipart.png"
                  alt="Try On Clipart"
                  className="card-img"
                />
                <div className="card-text">
                  <p>
                    Visualize and virtually try on clothing designs to see how they will look on you,
                    providing a realistic preview of your style!
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="measurement-card"
                onClick={() => handleCardClick('Closet')}
              >
                <h4 className="card-title">Our Closet</h4>
                <img
                  src="/src/assets/closetclippart.png"
                  alt="closetclipart"
                  className="card-img"
                />
                <div className="card-text">
                  <p>
                    Explore a wide range of available clothing, including dresses, shirts, sweaters,
                    and many more to find the perfect match for your style!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Get Measurements Section */}
        {selectedMenu === 'Get Measurements' && (
          <>
            {/* 1. Camera Permission Popup */}
            {showCameraPermission && (
              <div className="popup-container">
                <div className="popup-card">
                  <h4>Camera Permission</h4>
                  <p>Allow camera access to get your measurements</p>
                  <button onClick={() => handlePopUpClick('closeCamera')}>
                    Allow Camera
                  </button>
                </div>
              </div>
            )}

            {/* 2. Main Capture View (Show only after permission) */}
            {!showCameraPermission && (
              <div className="capture-process-container"> {/* New wrapper */}

                {/* Step Indicator (Left Side) */}
                <div className="step-indicator">
                  <p className={`step-item ${captureStep === 'front' ? 'step-active' : ''}`}>
                    Capturing Front View
                  </p>
                  <p className={`step-item ${captureStep === 'side' ? 'step-active' : ''}`}>
                    Capturing Side View
                  </p>
                  <p className={`step-item ${captureStep === 'analyzing' ? 'step-active' : ''}`}>
                    Analyzing Image
                  </p>
                  <p className={`step-item ${captureStep === 'output' ? 'step-active' : ''}`}>
                    Output Sizes
                  </p>
                </div>

                {/* Webcam and Measurement Card Area (Right Side) */}
                <div className="webcam-and-results-area">
                   {/* Only show webcam during capture steps */}
                   {(captureStep === 'front' || captureStep === 'side') && (
                    <>
                      <div className="webcam-container">
                        <Webcam
                            audio={false}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="webcam-component" // Ensure CSS exists
                            ref={webcamRef}
                            mirrored={videoConstraints.facingMode !== 'environment'}
                        />
                        
                      </div>
                      <button
                            onClick={handleSnapshot}
                            className="snapshot-button" // Ensure CSS exists
                            disabled={isButtonDisabled()}
                        >
                            {getButtonText()}
                        </button>
                      </>
                   )}

                    {/* Show Measurement Card when analyzing or outputting */}
                    {(captureStep === 'analyzing' || captureStep === 'output') && (
                      <div className="measurement-card measurement-card-results"> {/* Use modifier class */}
                        <h4 className="card-title">Measurement Details</h4>

                        {/* Display Snapshots if taken (optional) */}
                        {/*
                        {frontSnapshot && <img src={`data:image/jpeg;base64,${frontSnapshot}`} alt="Front" className="snapshot-preview"/>}
                        {sideSnapshot && <img src={`data:image/jpeg;base64,${sideSnapshot}`} alt="Side" className="snapshot-preview"/>}
                        */}

                        <div className="measurements-split-container">
                          {/* Left Column */}
                          <div className="measurements-column">
                            {/* ... measurement items ... */}
                             <div className="measurement-item">
                                <div className="measurement-label">Chest Circumference</div>
                                <div className="measurement-value">{measurements.chest}</div>
                              </div>
                              <div className="measurement-item">
                                <div className="measurement-label">Shoulder Width</div>
                                <div className="measurement-value">{measurements.shoulder}</div>
                              </div>
                              <div className="measurement-item">
                                <div className="measurement-label">Hip Length</div>
                                <div className="measurement-value">{measurements.hip}</div>
                              </div>
                              <div className="measurement-item">
                                <div className="measurement-label">Thigh Width</div>
                                <div className="measurement-value">{measurements.thigh}</div>
                              </div>
                          </div>
                          {/* Right Column */}
                          <div className="sizes-column">
                            {/* ... size items ... */}
                            <div className="measurement-item">
                                <div className="measurement-label">Size in US</div>
                                <div className="measurement-value">{sizes.us}</div>
                              </div>
                              <div className="measurement-item">
                                <div className="measurement-label">Size in UK</div>
                                <div className="measurement-value">{sizes.uk}</div>
                              </div>
                              <div className="measurement-item">
                                <div className="measurement-label">Size in Asian</div>
                                <div className="measurement-value">{sizes.asian}</div>
                              </div>
                          </div>
                        </div>
                        {/* Add a "Start Over" button here in the 'output' step */}
                        {captureStep === 'output' && (
                           <button onClick={resetCaptureProcess} className="start-over-button">
                             Start Over
                           </button>
                        )}
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* 3. Loading Modal (Rendered based on isLoading state) */}
            {isLoading && (
              <div className="loading-modal-overlay">
                <div className="loading-modal-content">
                  <p>Analyzing Images...</p>
                  <div className="spinner"></div> {/* Ensure CSS for spinner exists */}
                </div>
              </div>
            )}
          </>
        )}

        {/* Try On Section */}
        {selectedMenu === 'Try On' && <h2>Try On</h2>}

        {/* Closet Section */}
        {selectedMenu === 'Closet' && <h2>Closet</h2>}
      </div>
    </div>
  );
}

export default App;