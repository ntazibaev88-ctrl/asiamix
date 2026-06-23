"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="kk">
      <body style={{ margin: 0, background: "#080810", color: "#fff", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Бет жүктелмеді</h2>
          <p style={{ fontSize: "0.875rem", opacity: 0.6, marginBottom: "1.5rem" }}>
            {error?.message || "Күтпеген қате орын алды."}
          </p>
          <button
            onClick={unstable_retry}
            style={{ padding: "0.5rem 1.5rem", borderRadius: "0.75rem", background: "#7c3aed", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
          >
            Қайталап көру
          </button>
        </div>
      </body>
    </html>
  );
}
