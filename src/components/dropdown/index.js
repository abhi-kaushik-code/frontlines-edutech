
function Dropdown({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col ">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)} 
        className="border border-gray-400 rounded-md px-3 py-2 cursor cursor-pointer"
      >
        <option value="">{label} All</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
