import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (res.status === 201) {
        alert("✅ Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      <p>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")}>Login here</span>
      </p>
    </div>
  );
};

export default SignupPage;
