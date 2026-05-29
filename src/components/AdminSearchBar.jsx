import "../styles/adminSearch.css";

export default function AdminSearchBar({ search, setSearch, filter, setFilter }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Tümü</option>
        <option value="active">Aktif</option>
        <option value="blocked">Engelli</option>
        <option value="removed">Kaldırılmış</option>
      </select>
    </div>
  );
}
