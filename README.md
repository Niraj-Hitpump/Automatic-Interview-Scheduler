# 🤖 Automatic Interview Scheduler — Smart Slot Booking System

A production-ready Interview Scheduling Application built using **Java Spring Boot**, **Next.js (React)**, and **MySQL** that automates seamless interview slot coordination between candidates and interviewers.

It manages the entire flow:  
✔ Availability → ✔ Smart Slot Generation → ✔ Candidate Booking → ✔ Live Status Updates  
→ ✔ Interview Completion Tracking

> 🚀 Designed for scalable interview management with clean architecture, secure role-based access & modern UI.

---

## 🎥 Demo Video  
https://drive.google.com/file/d/1Eg5bC1FXqdyJtJebizI8C5degph4yAUt/view?usp=sharing

---

## ✨ Key Features

- 👤 **Role-based dashboards**: Candidate & Interviewer access
- 🗓 Weekly availability system with **auto-slot generation**
- 🔐 Secure JWT Authentication
- ⚙ DB-level transaction control to avoid **double-booking**
- 📝 Booking history + pagination for bulk data
- ❌ Cancel or ✔ Complete interview tracking
- 🎨 Elegant UI & responsive layouts

---

## 🏛️ Tech Stack

| Layer | Technologies |
|------|--------------|
| Frontend | Next.js (React), Tailwind CSS |
| Backend | Java Spring Boot |
| Database | MySQL |
| Build Tools | Maven, Node.js |
| Other | Postman, VS Code, IntelliJ IDEA |

---

## 🧠 System Flow

> Interviewer defines weekly availability →  
> System auto-generates slots →  
> Candidate books interview →  
> Status updates reflect across dashboards instantly

---

## 🖥️ User Interface Screens (Project UI Showcase)

| Screen | Preview |
|--------|---------|
| 🔐 Login Screen | ![Login](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/login.png) |
| 🛠 Admin Dashboard | ![Admin Dashboard](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/admin%20dashboard.png) |
| ⭐ Shortlist Candidate | ![Shortlist Candidate](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Shortlist%20Candidate.png) |
| 📄 Interview List | ![Interviewer List](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Interviewer%20list.png) |
| 🧑‍💼 Interviewer Dashboard | ![Interviewer Dashboard](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Interviewer%20Dashboard.png) |
| ⏱ Candidate Slot View | ![Candidate Slot](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Candidate%20Slot.png) |
| 📝 Booking Confirmation | ![Candidate Booking](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Candidate%20Booking.png) |
| 🕒 Remaining Slot View | ![Remaining Slot](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Candidate%20Remaining%20Slot.png) |

---

## 🗂 Project Structure

```bash
Automatic-Interview-Scheduler/
│
├── backend/          # Spring Boot API
├── frontend/         # Next.js UI
└── database/         # SQL schema & resources
