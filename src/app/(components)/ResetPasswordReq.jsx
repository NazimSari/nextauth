"use client";

import { useState } from "react";

const ResetPasswordReq = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/reset-password-req", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      setMessage(result.message);
    } catch (err) {
      setMessage("Error sending password reset request.");
    }
  };

  return (
    <div className="bg-slate-300 w-full max-w-6xl flex mx-auto mt-10 p-3">
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="ml-5 hover:underline" type="submit">
          Reset Password
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordReq;
