# 🤖 Automatic Interview Scheduler — Smart Slot Booking System

A production-ready Interview Scheduling Application built using **Java Spring Boot**, **Next.js (React)**, and **MySQL** that enables candidates to select from a list of interview slots while allowing interviewers to manage availability efficiently.

✔ Availability → ✔ Smart Slot Generation → ✔ Candidate Booking → ✔ Status Sync → ✔ Completion

> 🚀 Designed with clean APIs, race-condition safe DB operations & structured architecture.

---

## 📌 Project Objective

**Title:** Automatic Interview Scheduling  

**Description:**  
Develop a system using **Java Spring Boot + MySQL**, where:

- Interviewer provides **weekly availability**
- System generates interview slots for **next 2 weeks**
- Candidates can **select & confirm only one active slot**
- Interviewers define **maximum interviews per week**
- Multiple bookings allowed within weekly limit
- Slots can be **updated / cancelled** with proper validations

---

## 🎥 Demo Video  
🔗 https://drive.google.com/file/d/1Eg5bC1FXqdyJtJebizI8C5degph4yAUt/view?usp=sharing

---

## 🧠 System Flow (Requirement Alignment)

> **Flow:**  
1️⃣ Interviewer adds weekly availability  
2️⃣ System auto-generates slots for the next two weeks  
3️⃣ Candidate selects **a single slot**  
4️⃣ Slot confirmation shown & stored  
5️⃣ Interviewer can **update status** (Booked → Completed / Cancelled)

🔐 Strong DB checks prevent double bookings.

---

---

## 🖥️ UI Walkthrough

| Screen | Preview |
|--------|---------|
| 🔐 Login Screen | ![Login](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/login.png) |
| 🛠 Admin Dashboard | ![Admin Dashboard](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/admin%20dashboard.png) |
| ⭐ Shortlist Candidate | ![Shortlist Candidate](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Shortlist%20Candidate.png) |
| 📄 Interview List | ![Interview List](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/interviewer%20list.png) |
| 🧑‍💼 Interviewer Dashboard | ![Interviewer Dashboard](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Interviewer%20Dashboard.png) |
| ⏱ Candidate Slot View | ![Candidate Slot](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Candidate%20Slot.png) |
| 📝 Booking Confirmation | ![Candidate Booking](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Candidate%20Booking.png) |
| 🕒 Remaining Slot View | ![Remaining Slot](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Candidate%20Remaining%20Slot.png) |

---

## ✨ Key Features (Mapped to Evaluation Criteria)

| Requirement | Status |
|-----------|:-----:|
| Proper API naming & flows | ✔ Implemented |
| DB Schema + constraints | ✔ MySQL with FK + Unique booking |
| Race condition handling | ✔ DB-level validations + transactions |
| Design Patterns | ✔ Service Layer + DTO + Mapper patterns |
| Error handling | ✔ Global Exception Handler |
| UI to demonstrate workflow | ✔ Candidate & Interviewer dashboards |

---

## ⭐ Bonus Points Completed

| Bonus | Status |
|-------|:-----:|
| Basic UI Built | ✔ |
| Pagination for Slot Listing | ✔ Limit/Offset |
| Trade-off Discussions in Doc | ✔ |
| Clean Architecture Principles | ✔ Layered Architecture |
| Debouncing | ✔ On search/select input |
| JUNIT Test Cases | ➖ *(Planned)* |

---

## 🏛️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | Next.js (React), Tailwind CSS |
| Backend | Java Spring Boot |
| Database | MySQL |
| Authentication | JWT Tokens |
| Build Tools | Maven, Node.js |

---

## 🔐 API & Error-Handling Principles

- Proper **REST conventions** & HTTP status codes
- **Transactional** booking to avoid race conditions
- **Validation checks** before booking:
  - Slot exists
  - Slot available
  - Candidate has no active booking
  - Weekly capacity not exceeded

---

## 🗄️ Database Schema (Short Overview)

Tables Used:
- `users` (roles: admin, interviewer, candidate)
- `availability` (weekly input by interviewer)
- `slots` (generated for next 14 days)
- `bookings` (candidate → slot mapping with status)

➡ Schema supports future enhancements like feedback & job-role mapping.



## 📂 Project Structure

```bash
Automatic-Interview-Scheduler/
│
├── backend/          # Spring Boot APIs & Business Logic
├── frontend/         # Next.js UI Views & Auth
└── database/         # SQL schema & migration scripts
