import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main
          style={{
            padding: "32px",
            width: "100%",
            minHeight: "100vh",
            background: "#0b132b",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}
