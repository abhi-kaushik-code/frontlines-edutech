import "./App.css";
import Dropdown from "./components/dropdown";
import { useState, useEffect, useMemo, useRef } from "react";

function App() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loaderRef = useRef(null);

  const uniqueLocations = [...new Set(companies.map((c) => c.location))];
  const uniqueIndustries = [...new Set(companies.map((c) => c.industry))];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/companies/data.json");
        const data = await response.json();
        setCompanies(data.companies);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCompanies();
  }, []);

  const filterResults = useMemo(() => {
    const filtered = companies.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.industry.toLowerCase().includes(search.toLowerCase());

      const matchesLocation = locationFilter ? item.location === locationFilter : true;
      const matchesIndustry = industryFilter ? item.industry === industryFilter : true;

      return matchesSearch && matchesLocation && matchesIndustry;
    });

    if (sortColumn) {
      filtered.sort((a, b) => {
        const valA = a[sortColumn].toLowerCase();
        const valB = b[sortColumn].toLowerCase();
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [companies, search, locationFilter, industryFilter, sortColumn, sortOrder]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && visibleCount < filterResults.length) {
          setLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 20);
            setLoading(false);
          }, 500);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, visibleCount, filterResults.length]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6 md:p-14">
      {/* Filters */}
      <div className="filter-container">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search name, location, or industry"
          className="input-base w-[250px] md:w-[300px]"
        />
        <Dropdown label="Location" value={locationFilter} options={uniqueLocations} onChange={setLocationFilter} />
        <Dropdown label="Industry" value={industryFilter} options={uniqueIndustries} onChange={setIndustryFilter} />
        <button
          onClick={() => {
            setSearch("");
            setLocationFilter("");
            setIndustryFilter("");
            setSortColumn(null);
            setVisibleCount(20);
          }}
          className="btn"
        >
          Clear Filters
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th className="table-header table-cell" onClick={() => handleSort("name")}>
                Name {sortColumn === "name" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
              </th>
              <th className="table-header table-cell" onClick={() => handleSort("location")}>
                Location {sortColumn === "location" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
              </th>
              <th className="table-header table-cell" onClick={() => handleSort("industry")}>
                Industry {sortColumn === "industry" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filterResults.slice(0, visibleCount).length > 0 ? (
              filterResults.slice(0, visibleCount).map((company, i) => (
                <tr
                  key={company.id || i}
                  className={`table-row ${i % 2 === 0 ? "table-row-even" : "table-row-odd"} table-row-hover`}
                >
                  <td className="table-cell">{company.name}</td>
                  <td className="table-cell">{company.location}</td>
                  <td className="table-cell">{company.industry}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="table-cell text-center py-4">
                  No Results Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Loader */}
      <div ref={loaderRef} className="loader">
        {loading ? "Loading more..." : ""}
      </div>
    </div>
  );
}

export default App;
