import { Outlet } from "react-router";

export default function ProjectLayout() {
  return (
    <div>
        <div className="header_section mt-1 pt-4 pb-3 mb-5">
            <div className="container-fluid">
                <nav className="navbar navbar-light bg-light justify-content-start border border-0">
                <div className="form-inline position-absolute end-0 px-5">
                <ul className="list-unstyled"><li className="fs-3"><a href = "/login">Login</a>/<a href = "/register">Register</a></li></ul>
                </div>
                </nav>
            </div>
        </div>
        <Outlet />
    </div>
  );
}