export const fetcher = async (url) => {
	const token = localStorage.getItem("token");
	const res = await fetch(url, {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});
	if (!res.ok) throw new Error("An error occurred while fetching data.");
	return res.json();
};
