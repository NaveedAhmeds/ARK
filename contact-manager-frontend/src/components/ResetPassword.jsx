import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
	const { token } = useParams();
	const navigate = useNavigate();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setLoading(true);

		try {
			const res = await fetch(
				`https://api-for-contacts.vercel.app/api/auth/reset-password/${token}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ password }),
				}
			);

			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Failed to reset password");

			setMessage("Password reset successfully! Redirecting to login...");
			setTimeout(() => {
				navigate("/login");
			}, 3000);
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
			<h1 className="mb-5 display-5 fw-bold text-center">Reset Password</h1>

			<div
				className="card p-5 shadow-lg mx-auto"
				style={{ width: "100%", maxWidth: "450px", borderRadius: "15px" }}
			>
				{message && <div className="alert alert-success">{message}</div>}
				{error && <div className="alert alert-danger">{error}</div>}

				<form onSubmit={handleSubmit}>
					<div className="mb-3 text-start">
						<label className="form-label">New Password</label>
						<input
							type="password"
							className="form-control"
							placeholder="Enter new password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<div className="mb-3 text-start">
						<label className="form-label">Confirm Password</label>
						<input
							type="password"
							className="form-control"
							placeholder="Confirm new password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary w-100"
						disabled={loading}
					>
						{loading ? "Resetting..." : "Reset Password"}
					</button>
				</form>
			</div>
		</div>
	);
}
