import { useEffect, useState } from "react";
import { getDoctorProfile } from "../../services/doctorService";

const DoctorProfileCard = () => {

    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        loadDoctor();
    }, []);

    const loadDoctor = async () => {
        try {

            const user = JSON.parse(localStorage.getItem("user"));

            const res = await getDoctorProfile(user.id);

            setDoctor(res.doctor);

        } catch (error) {
            console.log(error);
        }
    };

    if (!doctor) return <p>Loading...</p>;

    return (
        <div className="profile-card">

            <img
                src={
                    doctor.image
                        ? `http://localhost:5000/uploads/doctors/${doctor.image}`
                        : "https://i.pravatar.cc/200"
                }
                alt={doctor.name}
            />

            <h3>{doctor.name}</h3>

            <p>{doctor.department}</p>

            <hr />

            <div className="profile-info">

                <div>
                    <strong>Qualification</strong>
                    <span>{doctor.qualification}</span>
                </div>

                <div>
                    <strong>Experience</strong>
                    <span>{doctor.experience}</span>
                </div>

                <div>
                    <strong>Consultation Fee</strong>
                    <span>₹ {doctor.fee}</span>
                </div>

                <div>
                    <strong>Status</strong>
                    <span>{doctor.status}</span>
                </div>

            </div>

        </div>
    );
};

export default DoctorProfileCard;