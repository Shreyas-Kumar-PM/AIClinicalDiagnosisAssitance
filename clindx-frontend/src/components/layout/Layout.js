import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#020617" }}>
      {/* Top Header */}
      <Header />

      {/* Body */}
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            padding: "32px",
            minHeight: "calc(100vh - 64px)",
            background:
              "linear-gradient(180deg, #020617 0%, #020617 40%, #0b132b 100%)",
            overflowY: "auto",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
