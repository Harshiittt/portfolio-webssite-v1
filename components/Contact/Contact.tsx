"use client";

import { useState } from "react";
import SectionTitle from "../PortfolioSections/SectionTitle";
import styles from "./Contact.module.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setErrorMsg(data.error ?? "Failed to send");
        setStatus("error");
      }
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Network error");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <SectionTitle num="05" title="Get in touch" />

      <p className={styles.description}>
        Have a question, project idea, or just want to say hi? Send me a message.
      </p>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={styles.input}
        />
        <input
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={styles.input}
        />
        <textarea
          placeholder="Your message"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={styles.textarea}
        />

        <button
          onClick={handleSubmit}
          disabled={status === "sending" || status === "sent"}
          className={styles.button}
        >
          {status === "sending" ? "Sending..." : status === "sent" ? "Message sent ✓" : "Send message →"}
        </button>

        {status === "error" && (
          <p className={styles.error}>
            {errorMsg || "Something went wrong. Please try again."}
          </p>
        )}
      </div>
    </section>
  );
}
