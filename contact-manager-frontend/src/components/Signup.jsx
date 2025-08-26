import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		const trimmedName = name.trim();
		const trimmedEmail = email.trim().toLowerCase();
		const trimmedPassword = password.trim();

		if (!trimmedName || !trimmedEmail || !trimmedPassword) {
			setError("All fields are required.");
			return;
		}

		try {
			const res = await fetch(
				"https://api-for-contacts.vercel.app/api/auth/signup",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: trimmedName,
						email: trimmedEmail,
						password: trimmedPassword,
					}),
				}
			);

			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Signup failed");

			setSuccess("Account created! Redirecting to login...");

			setTimeout(() => {
				navigate("/login");
			}, 1500);
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div
			className="d-flex flex-column align-items-center justify-content-center"
			style={{ minHeight: "100vh", padding: "2rem" }}
		>
			<h1
				className="mb-5 display-4 fw-bold text-center"
				style={{ lineHeight: "1.2" }}
			>
				Organize. Connect. Thrive. <br />
			</h1>

			<div
				className="card p-5 shadow-lg mx-auto"
				style={{ width: "100%", maxWidth: "450px", borderRadius: "15px" }}
			>
				<h2 className="mb-4 text-center">Sign Up</h2>
				{error && <div className="alert alert-danger text-start">{error}</div>}
				{success && (
					<div className="alert alert-success text-start">{success}</div>
				)}
				<form onSubmit={handleSubmit}>
					<div className="mb-3 text-start">
						<label className="form-label">Name</label>
						<input
							type="text"
							className="form-control"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>
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
					<button type="submit" className="btn btn-success w-100">
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
}
