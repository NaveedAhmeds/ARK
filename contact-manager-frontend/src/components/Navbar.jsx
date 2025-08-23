export default function Navbar({ onSearch, onLogout }) {
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
			<div className="container-fluid">
				<a className="navbar-brand" href="#">
					Contact Manager
				</a>
				<div className="d-flex ms-auto">
					<input
						className="form-control me-2"
						type="search"
						placeholder="Search contacts..."
						onChange={(e) => onSearch(e.target.value)}
					/>
					<button className="btn btn-outline-light" onClick={onLogout}>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}
