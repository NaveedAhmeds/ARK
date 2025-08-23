import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const navigate = useNavigate();
	const [contacts, setContacts] = useState([]);
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(5);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/");
		} else {
			fetchContacts(token);
		}
	}, [navigate]);

	const fetchContacts = async (token) => {
		try {
			const res = await fetch(
				"https://api-for-contacts-eox3.vercel.app/api/contacts",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
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
				`https://api-for-contacts-eox3.vercel.app/api/contacts/${id}`,
				{
					method: "DELETE",
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (!res.ok) throw new Error("Failed to delete contact");
			setContacts((prev) => prev.filter((c) => c._id !== id));
		} catch (err) {
			console.error(err.message);
		}
	};

	// Filter contacts based on search...
	const filteredContacts = contacts.filter(
		(c) =>
			c.name.toLowerCase().includes(search.toLowerCase()) ||
			c.email.toLowerCase().includes(search.toLowerCase())
	);

	// Pagination..
	const indexOfLast = currentPage * pageSize;
	const indexOfFirst = indexOfLast - pageSize;
	const currentContacts = filteredContacts.slice(indexOfFirst, indexOfLast);
	const totalPages = Math.ceil(filteredContacts.length / pageSize);

	return (
		<div
			className="container-fluid min-vh-100 py-5"
			style={{ backgroundColor: "#f8f9fa" }}
		>
			<div className="d-flex justify-content-between align-items-center mb-4 px-3">
				<h1 className="fw-bold">Your Contacts Dashboard</h1>
				<button className="btn btn-outline-danger" onClick={handleLogout}>
					Logout
				</button>
			</div>

			<div
				className="card shadow-lg p-4 w-100"
				style={{ maxWidth: "1000px", borderRadius: "15px" }}
			>
				<h2 className="mb-4">Welcome!</h2>
				<p className="lead">
					Manage your contacts easily. Add, edit, or delete them below.
				</p>

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

				{/* Contacts Table */}
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
									<button className="btn btn-sm btn-warning me-2">Edit</button>
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
				<nav>
					<ul className="pagination justify-content-center mt-3">
						{[...Array(totalPages).keys()].map((n) => (
							<li
								key={n + 1}
								className={`page-item ${currentPage === n + 1 ? "active" : ""}`}
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
			</div>
		</div>
	);
}
