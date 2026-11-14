import ProfileForm from "../../components/doctor/ProfileForm";
import ChangePassword from "../../components/doctor/ChangePassword";

import "../../assets/css/doctorDashboard.css";
import "../../assets/css/doctorProfile.css";

const Profile = () => {
  return (
    <div className="doctor-page-wrapper">

      <h2 className="doctor-page-title">
        My Profile
      </h2>

      <div className="doctor-profile-layout">

        <ProfileForm />

      

      </div>

    </div>
  );
};

export default Profile;