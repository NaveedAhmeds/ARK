import { useState, useEffect } from "react";

export default function AddContact({
	token,
	onContactAdded,
	contactToEdit,
	onClose,
}) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [notes, setNotes] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (contactToEdit) {
			setName(contactToEdit.name);
			setEmail(contactToEdit.email);
			setPhone(contactToEdit.phone || "");
			setNotes(contactToEdit.notes || "");
		}
	}, [contactToEdit]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		const method = contactToEdit ? "PUT" : "POST";
		const url = contactToEdit
			? `https://api-for-contacts.vercel.app/api/contacts/${contactToEdit._id}`
			: "https://api-for-contacts.vercel.app/api/contacts";

		try {
			const res = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ name, email, phone, notes }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to save contact");

			onContactAdded(data);
			onClose();
			setName("");
			setEmail("");
			setPhone("");
			setNotes("");
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="card shadow p-3 mb-4">
			<h5>{contactToEdit ? "Edit Contact" : "Add Contact"}</h5>
			{error && <div className="alert alert-danger">{error}</div>}
			<form onSubmit={handleSubmit}>
				<div className="mb-2">
					<input
						type="text"
						placeholder="Name"
						className="form-control"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="mb-2">
					<input
						type="email"
						placeholder="Email"
						className="form-control"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="mb-2">
					<input
						type="text"
						placeholder="Phone"
						className="form-control"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				</div>
				<div className="mb-2">
					<textarea
						placeholder="Notes"
						className="form-control"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
					/>
				</div>
				<div className="d-flex justify-content-end">
					<button type="submit" className="btn btn-primary me-2">
						{contactToEdit ? "Update" : "Add"}
					</button>
					<button type="button" className="btn btn-secondary" onClick={onClose}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
