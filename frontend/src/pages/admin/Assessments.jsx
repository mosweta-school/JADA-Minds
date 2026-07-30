import { useState } from "react";
import assessmentsData from "../../data/assessments";
import AssessmentForm from "../../components/admin/AssessmentForm";
import DeleteAssessmentDialog from "../../components/admin/DeleteAssessmentDialog";


function AdminAssessments() {
     const [assessments, setAssessments] = useState(assessmentsData);

    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [mode, setMode] = useState(null);

    const emptyAssessment = {
        title: "",
        category: "",
        questions: "",
        status: "",
    };

    const [formData, setFormData] = useState(emptyAssessment);

    const handleAddAssessment = () => {
  setAssessments([
    ...assessments,
    {
      id: Date.now(),
      ...formData,
    },
  ]);

  closeModal();
};

const handleEditAssessment = () => {
  setAssessments(
    assessments.map((assessment) =>
      assessment.id === selectedAssessment.id
        ? { ...selectedAssessment, ...formData }
        : assessment
    )
  );

  closeModal();
};

const handleDeleteAssessment = () => {
  setAssessments(
    assessments.filter(
      (assessment) => assessment.id !== selectedAssessment.id
    )
  );

  closeModal();
};

const closeModal = () => {
  setMode(null);
  setSelectedAssessment(null);
  setFormData(emptyAssessment);
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
          Assessments
        </h1>

        <button
            style={styles.button}
            onClick={() => {
                setSelectedAssessment(null);
                setFormData(emptyAssessment);
                setMode("add");
            }}
            >
            + Add Assessment
        </button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: "#f5f1ff" }}>
              <th style={styles.header}>Title</th>
              <th style={styles.header}>Category</th>
              <th style={styles.header}>Questions</th>
              <th style={styles.header}>Status</th>
              <th style={styles.header}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {assessments.map((assessment) => (
              <tr key={assessment.id}>
                <td style={styles.cell}>{assessment.title}</td>
                <td style={styles.cell}>{assessment.category}</td>
                <td style={styles.cell}>{assessment.questions}</td>
                <td style={styles.cell}>{assessment.status}</td>

                <td style={styles.cell}>
                  <button
                        style={styles.actionButton}
                        onClick={() => {
                            setSelectedAssessment(assessment);
                            setFormData(assessment);
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
                            setSelectedAssessment(assessment);
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
      <AssessmentForm
  mode={mode}
  formData={formData}
  setFormData={setFormData}
  selectedAssessment={selectedAssessment}
  handleAddAssessment={handleAddAssessment}
  handleEditAssessment={handleEditAssessment}
  onClose={closeModal}
/>

<DeleteAssessmentDialog
  mode={mode}
  selectedAssessment={selectedAssessment}
  handleDeleteAssessment={handleDeleteAssessment}
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

export default AdminAssessments;