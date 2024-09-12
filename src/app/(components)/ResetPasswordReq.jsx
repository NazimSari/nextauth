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
    <div className="w-full max-w-6xl flex flex-col mx-auto mt-10 p-3">
      <div className="flex flex-col items-center justify-center p-3 bg-slate-300 max-w-3xl mx-auto rounded-2xl">
        <p className="text-2xl font-semibold mb-8 p-3">
          Yeni şifre almak için lütfen e-posta adresinizi girin.
        </p>
        <div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              className="p-3 rounded-md mb-4"
              type="email"
              placeholder="E-posta adresinizi girin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="p-2 border rounded-md bg-slate-100 hover:bg-slate-200 mb-2"
              type="submit"
            >
              Şifrenizi Sıfırlayın
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordReq;
