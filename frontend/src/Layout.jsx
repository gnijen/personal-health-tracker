import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("first_name");
        navigate("/");
    };

    const tabClass = ({ isActive }) => (isActive ? "tab active" : "tab");

    return (
        <>
            <header className="app-header">
                <div className="brand">
                    <span className="brand-mark" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 3v5a4 4 0 0 0 8 0V3" />
                            <path d="M5 3h2M13 3h2" />
                            <path d="M10 12v3a5 5 0 0 0 10 0v-2" />
                            <circle cx="20" cy="11" r="2" />
                        </svg>
                    </span>
                    Personal Health Tracker
                </div>
                <nav className="tabs" aria-label="Main">
                    <NavLink to="/home" className={tabClass}>Home</NavLink>
                    <NavLink to="/medicines" className={tabClass}>Medicines</NavLink>
                    <NavLink to="/labs" className={tabClass}>Lab results</NavLink>
                </nav>
                <button className="secondary" onClick={handleSignOut}>Sign out</button>
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}