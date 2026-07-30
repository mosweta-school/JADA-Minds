import { Link } from "react-router-dom";

const features = [
    {
      icon: "Self-Assessments",
      title: "Self-Assessments",
      description: "Structured wellness questionnaires that help you understand your mental state and identify areas for growth.",
    },
    {
      icon: "Personalized Results",
      title: "Personalized Results",
      description: "Receive clear, actionable insights based on your responses, with recommendations tailored to your needs.",
    },
    {
      icon: "Verified Specialists",
      title: "Verified Specialists",
      description: "Browse a directory of qualified mental wellness professionals ready to support your journey.",
    },
    {
      icon: "Wellness Workshops",
      title: "Wellness Workshops",
      description: "Join guided group sessions on topics like stress management, mindfulness, and building healthy habits.",
    },
    {
      icon: "Educational Resources",
      title: "Educational Resources",
      description: "Access trusted guides, articles, and tools to deepen your understanding of mental wellbeing.",
    },
    {
      icon: "Progress Tracking",
      title: "Progress Tracking",
      description: "Monitor your wellness journey over time with visual summaries and assessment history.",
    },
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up securely in seconds to access the full platform.",
  },
  {
    number: "02",
    title: "Take an Assessment",
    description: "Complete a guided wellness questionnaire designed for early awareness and self-reflection.",
  },
  {
    number: "03",
    title: "Get Your Insights",
    description: "Receive a personalized wellness summary with clear recommendations and next steps.",
  },
  {
    number: "04",
    title: "Take Action",
    description: "Explore resources, connect with specialists, or join a workshop to continue growing.",
  },
];

const stats = [
  { value: "2,500+", label: "Assessments Completed" },
  { value: "150+", label: "Verified Specialists" },
  { value: "80+", label: "Workshops Hosted" },
  { value: "98%", label: "User Satisfaction" },
];

function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e8d4ff",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#6b3cb8" }}>JM</span>
          <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#6b3cb8" }}>JADA Minds</span>
        </Link>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link
            to="/login"
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "999px",
              fontWeight: "700",
              fontSize: "0.9rem",
              color: "#6b3cb8",
              background: "#f0e6ff",
              border: "1.5px solid #e8d4ff",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
          >
            Sign in
          </Link>
          <Link
            to="/login"
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "999px",
              fontWeight: "700",
              fontSize: "0.9rem",
              color: "#fff",
              background: "linear-gradient(135deg, #6b3cb8 0%, #8e5fd4 100%)",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(107, 60, 184, 0.25)",
              transition: "all 0.3s ease",
            }}
          >
            Get started
          </Link>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        <section
          style={{
            background: "linear-gradient(135deg, #2d1b69 0%, #6b3cb8 50%, #8e5fd4 100%)",
            color: "#fff",
            padding: "4rem 1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2.5rem",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "1rem",
                }}
              >
                Mental Wellness Platform
              </span>
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  marginBottom: "1.25rem",
                  color: "#fff",
                }}
              >
                Understand. Grow. Thrive.
              </h1>
              <p
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.2rem)",
                  lineHeight: "1.7",
                  color: "rgba(255,255,255,0.9)",
                  marginBottom: "2rem",
                  maxWidth: "520px",
                }}
              >
                JADA Minds helps you become more aware of your mental wellbeing through guided assessments,
                compassionate resources, and a welcoming space to grow.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
              <Link
                to="/login"
                style={{
                  padding: "0.9rem 1.8rem",
                  borderRadius: "999px",
                  fontWeight: "700",
                  fontSize: "1rem",
                  background: "#fff",
                  color: "#6b3cb8",
                  textDecoration: "none",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                }}
              >
                Get started free
              </Link>
                <Link
                  to="/login"
                  style={{
                    padding: "0.9rem 1.8rem",
                    borderRadius: "999px",
                    fontWeight: "700",
                    fontSize: "1rem",
                    color: "#fff",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  Learn more
                </Link>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  aspectRatio: "1 / 1",
                  borderRadius: "2rem",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "rgba(255,255,255,0.9)",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
                }}
              >
                JADA MINDS
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "4rem 1.5rem", background: "#faf5ff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span
                style={{
                  display: "inline-block",
                  background: "#f0e6ff",
                  color: "#6b3cb8",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "0.75rem",
                }}
              >
                What you can expect
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  fontWeight: "800",
                  color: "#2d1b69",
                  margin: "0 0 0.75rem",
                }}
              >
                Everything you need to support your wellness journey
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#6b5b95",
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: "1.7",
                }}
              >
                From self-assessment to specialist support, JADA Minds provides a calm, structured
                environment to understand and improve your mental wellbeing.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {features.map((feature) => (
                <div
                  key={feature.title}
                  style={{
                    background: "#fff",
                    border: "1px solid #e8d4ff",
                    borderRadius: "1.25rem",
                    padding: "1.75rem",
                    boxShadow: "0 8px 24px rgba(107, 60, 184, 0.06)",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(107, 60, 184, 0.12)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(107, 60, 184, 0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ fontSize: "0.8rem", display: "block", marginBottom: "0.75rem", fontWeight: "700", color: "#6b3cb8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {feature.icon}
                  </span>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#2d1b69",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#6b5b95",
                      lineHeight: "1.7",
                      margin: 0,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "4rem 1.5rem", background: "#fff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span
                style={{
                  display: "inline-block",
                  background: "#f0e6ff",
                  color: "#6b3cb8",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "0.75rem",
                }}
              >
                How it works
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  fontWeight: "800",
                  color: "#2d1b69",
                  margin: "0 0 0.75rem",
                }}
              >
                Start your wellness journey in four simple steps
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {steps.map((step) => (
                <div
                  key={step.number}
                  style={{
                    textAlign: "center",
                    padding: "1.5rem",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.85rem",
                      fontWeight: "800",
                      color: "#6b3cb8",
                      background: "#f0e6ff",
                      padding: "0.4rem 0.9rem",
                      borderRadius: "999px",
                      marginBottom: "1rem",
                    }}
                  >
                    {step.number}
                  </span>
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: "700",
                      color: "#2d1b69",
                      margin: "0 0 0.5rem",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.92rem",
                      color: "#6b5b95",
                      lineHeight: "1.7",
                      margin: 0,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "4rem 1.5rem", background: "linear-gradient(135deg, #f5f1ff 0%, #faf5ff 100%)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span
                style={{
                  display: "inline-block",
                  background: "#f0e6ff",
                  color: "#6b3cb8",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "0.75rem",
                }}
              >
                Trusted by the community
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  fontWeight: "800",
                  color: "#2d1b69",
                  margin: "0 0 0.75rem",
                }}
              >
                Making wellness accessible for everyone
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#fff",
                    border: "1px solid #e8d4ff",
                    borderRadius: "1.25rem",
                    padding: "2rem 1.5rem",
                    textAlign: "center",
                    boxShadow: "0 8px 24px rgba(107, 60, 184, 0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                      fontWeight: "800",
                      color: "#6b3cb8",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "#6b5b95",
                      fontWeight: "500",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            padding: "4rem 1.5rem",
            background: "linear-gradient(135deg, #2d1b69 0%, #6b3cb8 50%, #8e5fd4 100%)",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                fontWeight: "800",
                margin: "0 0 1rem",
                color: "#fff",
              }}
            >
              Ready to start your wellness journey?
            </h2>
            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                lineHeight: "1.7",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "2rem",
              }}
            >
              Join JADA Minds today and take the first step toward better mental wellbeing.
              Your journey to understanding, growing, and thriving starts here.
            </p>
            <Link
              to="/login"
              style={{
                padding: "1rem 2.5rem",
                borderRadius: "999px",
                fontWeight: "700",
                fontSize: "1.05rem",
                color: "#6b3cb8",
                background: "#fff",
                textDecoration: "none",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease",
              }}
            >
              Create your free account
            </Link>
          </div>
        </section>
      </main>

      <footer
        style={{
          background: "#2d1b69",
          color: "rgba(255,255,255,0.7)",
          textAlign: "center",
          padding: "2rem 1.5rem",
          fontSize: "0.9rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ fontWeight: "700", color: "#fff" }}>JADA Minds</span>
            <span style={{ margin: "0 0.75rem" }}>·</span>
            <span>Understand. Grow. Thrive.</span>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <a href="#" style={{ color: "rgba(255,255,255,0.7)", margin: "0 0.5rem", textDecoration: "none" }}>About</a>
            <a href="#" style={{ color: "rgba(255,255,255,0.7)", margin: "0 0.5rem", textDecoration: "none" }}>Privacy</a>
            <a href="#" style={{ color: "rgba(255,255,255,0.7)", margin: "0 0.5rem", textDecoration: "none" }}>Terms</a>
            <a href="#" style={{ color: "rgba(255,255,255,0.7)", margin: "0 0.5rem", textDecoration: "none" }}>Contact</a>
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)" }}>
            (c) 2026 JADA Minds. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
