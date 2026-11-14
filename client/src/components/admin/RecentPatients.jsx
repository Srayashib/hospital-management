const patients = [
  {
    id: 1,
    name: "John Doe",
    age: 28,
    doctor: "Dr. Smith",
    disease: "Heart Disease",
  },
  {
    id: 2,
    name: "Emma Watson",
    age: 34,
    doctor: "Dr. David",
    disease: "Diabetes",
  },
  {
    id: 3,
    name: "Robert Brown",
    age: 42,
    doctor: "Dr. James",
    disease: "Migraine",
  },
  {
    id: 4,
    name: "Sophia Wilson",
    age: 29,
    doctor: "Dr. Olivia",
    disease: "Fever",
  },
];

const RecentPatients = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-xl font-bold text-slate-800">
          Recent Patients
        </h2>

        <button className="text-sky-600 hover:text-sky-700 font-medium">
          View All
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-200">

              <th className="text-left py-3">Patient</th>

              <th className="text-left py-3">Age</th>

              <th className="text-left py-3">Doctor</th>

              <th className="text-left py-3">Disease</th>

            </tr>

          </thead>

          <tbody>

            {patients.map((patient) => (

              <tr
                key={patient.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >

                <td className="py-4 font-medium">
                  {patient.name}
                </td>

                <td>{patient.age}</td>

                <td>{patient.doctor}</td>

                <td>{patient.disease}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RecentPatients;