const RecentPatients = () => {
  return (
    <div className="table-card">

      <h3>Recent Patients</h3>

      <table>

        <thead>

          <tr>

            <th>Name</th>

            <th>Age</th>

            <th>Disease</th>

            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td>Rahul Roy</td>

            <td>35</td>

            <td>Fever</td>

            <td>Recovered</td>

          </tr>

        </tbody>

      </table>

    </div>
  );
};

export default RecentPatients;