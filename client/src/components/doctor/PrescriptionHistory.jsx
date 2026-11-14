const history = [
  {
    patient: "Rahul Roy",
    medicine: "Paracetamol",
    date: "02 Aug 2026",
  },
  {
    patient: "Ananya Das",
    medicine: "Azithromycin",
    date: "01 Aug 2026",
  },
];

const PrescriptionHistory = () => {
  return (
    <div className="table-card">

      <h3>Prescription History</h3>

      <table>

        <thead>

          <tr>

            <th>Patient</th>

            <th>Medicine</th>

            <th>Date</th>

          </tr>

        </thead>

        <tbody>

          {history.map((item, index) => (

            <tr key={index}>

              <td>{item.patient}</td>

              <td>{item.medicine}</td>

              <td>{item.date}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default PrescriptionHistory;