# JADA Minds – Mental Wellness Support Platform

> **Understand. Grow. Thrive.**

JADA Minds is a web-based mental wellness support platform designed to help students and young professionals become more aware of their mental wellbeing through self-assessments, educational resources, specialist support, and wellness workshops. The platform emphasizes **early awareness, self-management, and access to support** rather than medical diagnosis.

---

## Project Overview

Mental wellness challenges such as stress, anxiety, burnout, and emotional exhaustion are becoming increasingly common among students and young professionals. Unfortunately, many individuals fail to recognize early warning signs or know where to seek appropriate support.

JADA Minds provides a centralized platform where users can:

- Assess their mental wellbeing
- Receive personalized wellness recommendations
- Access trusted educational resources
- Browse verified mental wellness specialists
- Register for wellness workshops
- Track their wellness journey over time

---

# Problem Statement

Mental wellness challenges such as stress, anxiety, burnout, and emotional exhaustion are increasingly affecting students and young professionals. Many people fail to recognize early warning signs or know where to seek support.

Existing solutions are often expensive, difficult to access, or focus primarily on treatment rather than prevention, awareness, and self-management.

---

# Proposed Solution

JADA Minds is a web-based mental wellness support platform that promotes awareness, education, and early intervention by providing users with:

- Wellness self-assessments
- Personalized recommendations
- Educational wellness resources
- Specialist directory
- Wellness workshop registration
- Wellness progress tracking

The platform does **not** provide medical diagnosis. Instead, it empowers users to better understand their wellbeing and seek appropriate support when needed.

---

#  Project Objectives

- Promote mental wellness awareness
- Encourage early self-assessment
- Provide trusted educational resources
- Connect users with verified specialists
- Improve access to wellness workshops
- Track personal wellness progress
- Provide a secure and user-friendly platform

---

# User Roles

## Client

Clients can:

- Register and login securely
- Complete wellness questionnaires
- Receive personalized wellness summaries
- Access wellness resources
- Browse specialists
- Register for workshops
- Track wellness progress
- Manage their profile

---

## Administrator

Administrators manage the entire platform.

Responsibilities include:

- Verify specialist credentials
- Manage users
- Manage questionnaires
- Manage workshops
- Manage educational resources
- View reports
- Enforce Role-Based Access Control (RBAC)

---

##  Specialist

Verified specialists can:

- Review client assessments
- Provide recommendations
- Record follow-up notes
- Manage appointments
- Participate in wellness workshops

---

# Specialist Verification Process

To ensure quality mental wellness support, specialists must be verified before accessing the Specialist Dashboard.

### Registration Process

1. Register as a Specialist
2. Upload:
   - National ID
   - Professional License
   - Degree Certificate
   - Registration Number
3. Application status becomes **Pending Approval**
4. Administrator reviews submitted documents
5. Administrator approves or rejects the application
6. Approved specialists receive access to the Specialist Dashboard

---

# Minimum Viable Product (MVP)

## Authentication

- Register
- Login
- Logout
- Password Reset
- JWT Authentication

## Dashboard

- User Overview
- Quick Actions

## Wellness Assessment

- Questionnaire
- Assessment Submission

## Results

- Wellness Summary
- Personalized Recommendations

## Resources

- Educational Wellness Content

## Specialists

- Specialist Directory

## Workshops

- Workshop Listing
- Workshop Registration

## Progress

- Assessment History
- Wellness Progress Tracking

## Profile

- Account Management

---

# System Architecture

```
Frontend (React + Vite)
          │
          ▼
REST API (Flask)
          │
          ▼
Authentication (JWT)
          │
          ▼
PostgreSQL Database
```

---

# Technology Stack

## Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios

## Backend

- Flask
- SQLAlchemy
- Flask-JWT-Extended
- Flask-Migrate

## Database

- PostgreSQL
- SQLite (Development)

## Authentication

- JWT
- Password Hashing

## Testing

- Postman
- Pytest

## Version Control

- Git
- GitHub

## Deployment

- Render (Backend)
- Vercel (Frontend)

---

# Security

The system implements **Role-Based Access Control (RBAC).**

A single login page authenticates all users.

Depending on their role, users are redirected to:

- Client Dashboard
- Specialist Dashboard
- Administrator Dashboard

JWT stores the authenticated user's role, and backend endpoints are protected accordingly.

---

# Recommendation Algorithm

JADA Minds uses a **Rule-Based Recommendation System.**

### Workflow

1. User completes the wellness questionnaire.
2. Every answer is assigned a score.
3. Scores are totaled.
4. The total score determines the user's wellness category.

Example:

- Low Stress
- Moderate Stress
- High Stress

Based on the category, the platform recommends:

- Educational Resources
- Wellness Workshops
- Specialists

---

# Project Structure

```
JADA-Minds/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── assessments/
│   │   ├── questions/
│   │   ├── workshops/
│   │   ├── specialists/
│   │   ├── resources/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── middleware/
│   │   ├── extensions.py
│   │   ├── config.py
│   │   └── __init__.py
│   │
│   ├── migrations/
│   ├── tests/
│   ├── requirements.txt
│   ├── seed.py
│   ├── run.py
│   └── .env.example
│
├── docs/
│
├── README.md
├── LICENSE
└── .gitignore
```

---

# REST API Endpoints

## Authentication

```
POST /register
POST /login
POST /forgot-password
POST /reset-password
```

---

## Questionnaire

```
GET /questions
POST /assessment
GET /assessment/<id>
```

---

## Results & Progress

```
GET /results
GET /progress
```

---

## Specialists

```
GET /specialists
GET /specialists/<id>
```

---

## Workshops

```
GET /workshops
POST /workshops/register
DELETE /workshops/register/<id>
```

---

## Profile

```
GET /profile
PUT /profile
```

---

# Getting Started

## Clone the repository

```bash
git clone git@github.com:mosweta-school/JADA-Minds.git 
```

## Navigate to the project

```bash
cd JADA-Minds
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run migrations

```bash
flask db upgrade
```

Start the server

```bash
python run.py
```

---

## Frontend Setup

Open another terminal.

```bash
cd frontend

npm install

npm run dev
```

---

# 🌿 Git Workflow

## Branches

```
main
```

Production-ready code.

```
development
```

Integration branch.

```
ft/*
```

Individual feature development.

Examples:

```
ft/authentication

ft/dashboard

ft/questionnaire

ft/workshops

ft/resources
```

---

## Development Workflow

1. Pull the latest development branch.

```bash
git checkout development
git pull origin development
```

2. Create a feature branch.

```bash
git checkout -b ft/feature-name
```

3. Work on your feature.

4. Commit changes.

```bash
git add .
git commit -m "Describe feature"
```

5. Push your branch.

```bash
git push origin ft/feature-name
```

6. Open a Pull Request targeting the **development** branch.

7. After review and approval, merge into **development**.

8. When all features are complete:

```
development → main
```

---

# Future Improvements

- AI-powered wellness recommendations
- Appointment booking with specialists
- Email notifications
- Push notifications
- Mobile application
- Wellness journaling
- Mood tracking
- Analytics dashboard
- Teleconsultation support
- Emergency support integration

---

# Contributors

This project is being developed collaboratively by the JADA Minds development team.

- Project Lead & Backend Architect
- Frontend Lead
- UI/UX Designer
- Backend API Developer & DevOps

---
# Collaboration
Trello board
https://trello.com/b/jpPFko3z/jada-minds-module-5-group-project

# License

This project is licensed under the MIT License.

---

## JADA Minds

**Understand. Grow. Thrive.**
