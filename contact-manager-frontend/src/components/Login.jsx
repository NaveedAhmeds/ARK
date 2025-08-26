import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false); // new state
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const trimmedEmail = email.trim().toLowerCase();
		const trimmedPassword = password.trim();

		if (!trimmedEmail || !trimmedPassword) {
			setError("Please enter both email and password.");
			setLoading(false);
			return;
		}

		try {
			const res = await fetch(
				"https://api-for-contacts.vercel.app/api/auth/login",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email: trimmedEmail,
						password: trimmedPassword,
					}),
				}
			);

			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Login failed");

			localStorage.setItem("token", data.token);
			navigate("/Dashboard");
		} catch (err) {
			setError(err.message || "Server error, please try again later.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="d-flex flex-column align-items-center justify-content-center"
			style={{
				minHeight: "100vh",
				padding: "2rem",
				backgroundColor: "#f8f9fa",
			}}
		>
			<h1
				className="mb-5 display-4 fw-bold text-center"
				style={{ lineHeight: "1.2" }}
			>
				Welcome Back! <br />
				Let’s get you connected with your contacts.
			</h1>

			<div
				className="card p-5 shadow-lg mx-auto"
				style={{ width: "100%", maxWidth: "450px", borderRadius: "15px" }}
			>
				<h2 className="mb-4 text-center">Login</h2>
				{error && <div className="alert alert-danger text-start">{error}</div>}

				<form onSubmit={handleSubmit}>
					<div className="mb-3 text-start">
						<label className="form-label">Email</label>
						<input
							type="email"
							className="form-control"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="mb-3 text-start">
						<label className="form-label">Password</label>
						<input
							type="password"
							className="form-control"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary w-100"
						disabled={loading}
					>
						{loading ? (
							<>
								<span className="spinner-border spinner-border-sm me-2"></span>
								Logging In...
							</>
						) : (
							"Login"
						)}
					</button>
				</form>

				<p className="mt-3 text-center">
					<a href="/forgot-password">Forgot Password?</a>
				</p>
			</div>
		</div>
	);
}
