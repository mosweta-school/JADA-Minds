import { useState } from "react";
import resourcesData from "../../data/resources";
import ResourceForm from "../../components/admin/ResourceForm";
import DeleteResourceDialog from "../../components/admin/DeleteResourceDialog";

function AdminResources() {
    const [resources, setResources] = useState(resourcesData);
    const [selectedResource, setSelectedResource] = useState(null);
    const [mode, setMode] = useState(null);

    const emptyResource = {
        title: "",
        category: "",
        type: "",
        status: "",
    };

    const [formData, setFormData] = useState(emptyResource);

    const handleAddResource = () => {
  setResources([
    ...resources,
    {
      id: Date.now(),
      ...formData,
    },
  ]);

  setFormData(emptyResource);
  setMode(null);
};

const handleEditResource = () => {
  setResources(
    resources.map((resource) =>
      resource.id === selectedResource.id
        ? { ...resource, ...formData }
        : resource
    )
  );

  setSelectedResource(null);
  setFormData(emptyResource);
  setMode(null);
};

const handleDeleteResource = () => {
  setResources(
    resources.filter(
      (resource) => resource.id !== selectedResource.id
    )
  );

  setSelectedResource(null);
  setMode(null);
};

const closeModal = () => {
  setSelectedResource(null);
  setFormData(emptyResource);
  setMode(null);
};


  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ color: "#6b3cb8", margin: 0 }}>
          Resources
        </h1>

        <button
            style={styles.button}
            onClick={() => {
                setSelectedResource(null);
                setFormData(emptyResource);
                setMode("add");
            }}
            >
            + Add Resource
            </button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: "#f5f1ff" }}>
              <th style={styles.header}>Title</th>
              <th style={styles.header}>Category</th>
              <th style={styles.header}>Type</th>
              <th style={styles.header}>Status</th>
              <th style={styles.header}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td style={styles.cell}>{resource.title}</td>
                <td style={styles.cell}>{resource.category}</td>
                <td style={styles.cell}>{resource.type}</td>
                <td style={styles.cell}>{resource.status}</td>

                <td style={styles.cell}>
                  <button
                    style={styles.actionButton}
                    onClick={() => {
                      setSelectedResource(resource);
                      setFormData(resource);
                      setMode("edit");
                    }}
                  >
                    Edit
                  </button>

                  <button
                        style={{
                            ...styles.actionButton,
                            background: "#dc3545",
                        }}
                        onClick={() => {
                            setSelectedResource(resource);
                            setMode("delete");
                        }}
                        >
                        Delete
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ResourceForm
  mode={mode}
  formData={formData}
  setFormData={setFormData}
  selectedResource={selectedResource}
  handleAddResource={handleAddResource}
  handleEditResource={handleEditResource}
  onClose={closeModal}
/>

<DeleteResourceDialog
  mode={mode}
  selectedResource={selectedResource}
  handleDeleteResource={handleDeleteResource}
  onClose={closeModal}
/>
    </div>
 
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(107,60,184,.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  header: {
    textAlign: "left",
    padding: "1rem",
    color: "#6b3cb8",
    borderBottom: "1px solid #eee",
  },

  cell: {
    padding: "1rem",
    borderBottom: "1px solid #eee",
  },

  button: {
    background: "#6b3cb8",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.25rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  actionButton: {
    marginRight: ".5rem",
    border: "none",
    background: "#6b3cb8",
    color: "#fff",
    padding: ".45rem .8rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminResources;