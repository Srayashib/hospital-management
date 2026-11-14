import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

const ReportUpload = () => {
  const [fileName, setFileName] = useState("");

  const handleFile = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="report-upload">

      <h3>Upload Medical Report</h3>

      <label className="upload-report-box">

        <FaCloudUploadAlt className="upload-icon" />

        <p>
          {fileName || "Click to Upload Report"}
        </p>

        <input
          type="file"
          hidden
          onChange={handleFile}
        />

      </label>

      <button className="primary-btn">
        Upload Report
      </button>

    </div>
  );
};

export default ReportUpload;