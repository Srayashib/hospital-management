import { useState } from "react";

const ChangePassword = () => {

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {

    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log(passwords);

  };

  return (
    <div className="change-password">

      <h3>Change Password</h3>

      <form onSubmit={handleSubmit}>

        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          onChange={handleChange}
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="primary-btn"
        >
          Update Password
        </button>

      </form>

    </div>
  );
};

export default ChangePassword;