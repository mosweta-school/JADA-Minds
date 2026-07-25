function Sidebar() {
  return (
    <aside className="w-64 bg-blue-700 text-white p-6">
      <h2 className="text-lg font-semibold mb-6">
        Menu
      </h2>

      <ul className="space-y-4">
        <li>Dashboard</li>
        <li>Assessment</li>
        <li>Results</li>
        <li>Resources</li>
        <li>Specialists</li>
        <li>Workshops</li>
        <li>Profile</li>
      </ul>
    </aside>
  );
}

export default Sidebar;