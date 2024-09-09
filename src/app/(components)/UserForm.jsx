"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UserForm = () => {
  const router = useRouter();
  const [formData, setFromData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFromData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const res = await fetch("/api/Users", {
      method: "POST",
      body: JSON.stringify({ formData }),
      "content-type": "application/json",
    });
    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      router.refresh();
      router.push("/");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <h1>Create User</h1>
        <label>Full Name</label>
        <input
          className="m-2 bg-slate-400 rounded"
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          required={true}
          value={formData.name}
        />
        <label>Email</label>
        <input
          className="m-2 bg-slate-400 rounded"
          type="text"
          id="email"
          name="email"
          onChange={handleChange}
          required={true}
          value={formData.email}
        />
        <label>Password</label>
        <input
          className="m-2 bg-slate-400 rounded"
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          required={true}
          value={formData.password}
        />
        <input
          type="submit"
          value="Create User"
          className="bg-blue-300 hover:bg-blue-400"
        />
      </form>
      <p className="text-red-500">{errorMessage}</p>
    </>
  );
};

export default UserForm;
