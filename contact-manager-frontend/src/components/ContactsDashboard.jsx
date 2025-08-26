import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddContact from "./AddContact";

export default function Dashboard() {
	const navigate = useNavigate();
	const [contacts, setContacts] = useState([]);
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(5);
	const [showAddForm, setShowAddForm] = useState(false);
	const [contactToEdit, setContactToEdit] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) navigate("/");
		else fetchContacts(token);
	}, [navigate]);

	const fetchContacts = async (token) => {
		try {
			const res = await fetch(
				"https://api-for-contacts.vercel.app/api/contacts",
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to fetch contacts");
			setContacts(data);
		} catch (err) {
			console.error(err.message);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/");
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this contact?"))
			return;
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(
				`https://api-for-contacts.vercel.app/api/contacts/${id}`,
				{ method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
			);
			if (!res.ok) throw new Error("Failed to delete contact");
			setContacts((prev) => prev.filter((c) => c._id !== id));
		} catch (err) {
			console.error(err.message);
		}
	};

	const handleAddOrUpdate = (newOrUpdatedContact) => {
		setContacts((prev) => {
			const exists = prev.find((c) => c._id === newOrUpdatedContact._id);
			if (exists) {
				return prev.map((c) =>
					c._id === newOrUpdatedContact._id ? newOrUpdatedContact : c
				);
			} else {
				return [newOrUpdatedContact, ...prev];
			}
		});
		setShowAddForm(false);
		setContactToEdit(null);
	};

	// Filter contacts...
	const filteredContacts = contacts.filter(
		(c) =>
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.email.toLowerCase().includes(search.toLowerCase())
	);

	// Pagination...
	const indexOfLast = currentPage * pageSize;
	const indexOfFirst = indexOfLast - pageSize;
	const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);
	const totalPages = Math.ceil(filteredContacts.length / pageSize);

	return (
		<div
			className="container-fluid min-vh-100 d-flex flex-column align-items-center py-5"
			style={{ backgroundColor: "#f8f9fa" }}
		>
			{/* Header */}
			<div
				className="d-flex justify-content-between align-items-center mb-4 w-100 px-3"
				style={{ maxWidth: "1000px" }}
			>
				<h1 className="fw-bold">User Contacts</h1>
				<div>
					<button
						className="btn btn-success me-2"
						onClick={() => {
							setShowAddForm(true);
							setContactToEdit(null);
						}}
					>
						Add Contact
					</button>
					<button className="btn btn-outline-danger" onClick={handleLogout}>
						Logout
					</button>
				</div>
			</div>

			{/* Add / Edit Form */}
			{showAddForm && (
				<div className="w-100 d-flex justify-content-center mb-4">
					<div style={{ width: "100%", maxWidth: "600px" }}>
						<AddContact
							token={localStorage.getItem("token")}
							contactToEdit={contactToEdit}
							onContactAdded={handleAddOrUpdate}
							onClose={() => {
								setShowAddForm(false);
								setContactToEdit(null);
							}}
						/>
					</div>
				</div>
			)}

			{/* Contacts Table */}
			{contacts.length > 0 ? (
				<div
					className="card shadow-lg p-4 w-100"
					style={{ maxWidth: "1000px", borderRadius: "15px" }}
				>
					{/* Search */}
					<div className="mb-3">
						<input
							type="text"
							className="form-control"
							placeholder="Search by name or email"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					{/* Table */}
					<table className="table table-hover mt-3">
						<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Phone</th>
								<th>Notes</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{currentContacts.map((c) => (
								<tr key={c._id}>
									<td>{c.name}</td>
									<td>{c.email}</td>
									<td>{c.phone}</td>
									<td>{c.notes}</td>
									<td>
										<button
											className="btn btn-sm btn-warning me-2"
											onClick={() => {
												setContactToEdit(c);
												setShowAddForm(true);
											}}
										>
											Edit
										</button>
										<button
											className="btn btn-sm btn-danger"
											onClick={() => handleDelete(c._id)}
										>
											Delete
										</button>
									</td>
								</tr>
							))}
							{currentContacts.length === 0 && (
								<tr>
									<td colSpan="5" className="text-center text-muted">
										No contacts found.
									</td>
								</tr>
							)}
						</tbody>
					</table>

					{/* Pagination */}
					{totalPages > 1 && (
						<nav>
							<ul className="pagination justify-content-center mt-3">
								{[...Array(totalPages).keys()].map((n) => (
									<li
										key={n + 1}
										className={`page-item ${
											currentPage === n + 1 ? "active" : ""
										}`}
									>
										<button
											className="page-link"
											onClick={() => setCurrentPage(n + 1)}
										>
											{n + 1}
										</button>
									</li>
								))}
							</ul>
						</nav>
					)}
				</div>
			) : (
				!showAddForm && (
					<div className="text-center mt-5 text-muted">
						<p>No contacts yet. Click “Add Contact” to start your journey!</p>
					</div>
				)
			)}
		</div>
	);
}
