// src/components/ForgotPassword.jsx
import { useState } from "react";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");
		setLoading(true);

		try {
			const res = await fetch(
				"https://api-for-contacts-eox3.vercel.app/api/auth/forgot-password",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email }),
				}
			);

			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to send reset link");

			setMessage(
				"Password reset link sent! Check your email for further instructions."
			);
			setEmail("");
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
			<h1 className="mb-5 display-5 fw-bold text-center">Forgot Password</h1>

			<div
				className="card p-5 shadow-lg mx-auto"
				style={{ width: "100%", maxWidth: "450px", borderRadius: "15px" }}
			>
				{message && <div className="alert alert-success">{message}</div>}
				{error && <div className="alert alert-danger">{error}</div>}

				<form onSubmit={handleSubmit}>
					<div className="mb-3 text-start">
						<label className="form-label">Email</label>
						<input
							type="email"
							className="form-control"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary w-100"
						disabled={loading}
					>
						{loading ? "Sending..." : "Send Reset Link"}
					</button>
				</form>
			</div>
		</div>
	);
}
