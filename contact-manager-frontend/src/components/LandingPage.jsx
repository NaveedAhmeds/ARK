import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import "./LandingPage.css";

export default function LandingPage() {
	const navigate = useNavigate();

	return (
		<div className="landing-page">
			<div className="overlay d-flex flex-column justify-content-center align-items-center text-center">
				<h1 className="display-4 fw-bold mb-3">
					Manage Your Contacts Effortlessly
				</h1>
				<p className="lead mb-4">
					Keep track of all your contacts in one place. Add, edit, and organize
					them easily.
				</p>

				<div>
					<button
						className="btn btn-primary btn-lg me-3 shadow"
						onClick={() => navigate("/login")}
					>
						Login
					</button>
					<button
						className="btn btn-secondary btn-lg shadow"
						onClick={() => navigate("/signup")}
					>
						Sign Up
					</button>
				</div>
			</div>
		</div>
	);
}
