const reports = [
  {
    patient: "Rahul Roy",
    report: "Blood Test",
    date: "02 Aug 2026",
    status: "Uploaded",
  },
  {
    patient: "Priya Das",
    report: "X-Ray",
    date: "01 Aug 2026",
    status: "Uploaded",
  },
];

const ReportsTable = () => {
  return (
    <div className="table-card">

      <h3>Medical Reports</h3>

      <table>

        <thead>

          <tr>

            <th>Patient</th>

            <th>Report</th>

            <th>Date</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {reports.map((item, index) => (

            <tr key={index}>

              <td>{item.patient}</td>

              <td>{item.report}</td>

              <td>{item.date}</td>

              <td>

                <span className="status-completed">
                  {item.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default ReportsTable;