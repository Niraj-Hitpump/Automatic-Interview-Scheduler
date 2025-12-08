# 🤖 Automatic Interview Scheduler

A production-ready Interview Scheduling Application built using **Java Spring Boot**, **Next.js (React)**, and **MySQL** that automates end-to-end interview booking between candidates and interviewers.

✔ Availability → ✔ Smart Slot Generation → ✔ Candidate Booking → ✔ Status Sync → ✔ Completion Tracking

> 🚀 Designed with clean APIs, race-condition-safe DB operations & scalable layered architecture.

---

## 📌 Project Objective

**Title:** Automatic Interview Scheduling  

**Description:**  
Develop a smart scheduling system using **Spring Boot + MySQL**, where:

- Interviewers provide **weekly availability**
- System generates interview slots for **next 2 weeks**
- Candidates can **select & confirm only one active slot**
- Interviewers define **maximum interviews per week**
- Multiple bookings allowed within weekly limit
- Slots can be **updated / cancelled** with validations
- End-to-end workflow UI for both users

---

## 🎥 Demo Video  
📍 Watch Here → https://drive.google.com/file/d/1Eg5bC1FXqdyJtJebizI8C5degph4yAUt/view?usp=sharing

---

## 🧠 System Flow — Requirement Alignment

> **Workflow:**  
1️⃣ Interviewer sets weekly availability  
2️⃣ System auto-generates slots for the next two weeks  
3️⃣ Candidate selects **a single active slot**  
4️⃣ Slot confirmation stored + reflected for both  
5️⃣ Interviewer can **update interview status**  
  (BOOKED → COMPLETED / CANCELLED)

🔐 Strong database validations prevent **double-booking**

---

## 🖥️ UI Walkthrough

| Screen | Preview |
|--------|---------|
| 🔐 Login Screen | ![Login](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/login.png) |
| 🛠 Admin Dashboard | ![Admin Dashboard](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/admin%20dashboard.png) |
| ⭐ Shortlist Candidate | ![Shortlist Candidate](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Shortlist%20Candidate.png) |
| 📄 Interview List | ![Interview List](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Interviewer%20list.png) |
| 🧑‍💼 Interviewer Dashboard | ![Interviewer Dashboard](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Interviewer%20Dashboard.png) |
| ⏱ Candidate Slot View | ![Candidate Slot](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Candidate%20Slot.png) |
| 📝 Booking Confirmation | ![Candidate Booking](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Candidate%20Booking.png) |
| 🕒 Remaining Slot View | ![Remaining Slot](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/frontend/public/images/Candidate%20Remaining%20Slot.png) |

---

## ✨ Key Features (Evaluation Criteria Mapping)

| Requirement | Status |
|-----------|:-----:|
| Proper API naming & flows | ✔ |
| DB Schema + Constraints | ✔ |
| Race-condition handling | ✔ |
| Service + DTO + Mapper pattern | ✔ |
| Exception handling | ✔ |
| UI workflows for entire lifecycle | ✔ |

---

## ⭐ Bonus Features Implemented

| Bonus | Status |
|-------|:-----:|
| Clean UI with dashboard | ✔ |
| Pagination (Slot Listing) | ✔ |
| Trade-off documentation | ✔ |
| Layered architecture principles | ✔ |
| Debouncing (Search/Select Inputs) | ✔ |
| JUnit Test Cases | 🟡 *(Planned)* |

---

## 🏛️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | Next.js (React), Tailwind CSS |
| Backend | Java Spring Boot |
| Database | MySQL |
| Authentication | JWT |
| Build Tools | Maven, Node.js |

---

## 🔐 API & Error-Handling Principles

✔ REST conventions + structured request/response  
✔ Database transactions for slot booking  
✔ Mandatory validations:

- Slot exists  
- Slot still **AVAILABLE**
- Candidate has **no active booking**
- Interviewer **capacity not exceeded**

📌 Ensures **no double booking** + consistent status sync.

---

## 🗄️ Database Design — Automatic Interview Scheduler

This database design supports coordinated scheduling across three stakeholders:

- **Admin** → Manages user access
- **Interviewer** → Defines availability & updates status
- **Candidate** → Books a single active slot

---

### 🧩 Table Overview

| Table | Description |
|-------|-------------|
| Interviewer | Credentials + profile for interviewers |
| Availability | Interviewers' weekly availability entries |
| Slot | Auto-generated bookable time intervals |
| Candidate | Candidate login and user data |
| Booking | Candidate-Slot mapping with booking status |

---

### 📘 ER Diagram

| 📘 ER Diagram | ![ER Diagram](https://github.com/Niraj-Hitpump/Automatic-Interview-Scheduler/blob/main/docs/ER.png) |

---

## 🔄 UI Interaction → DB Operations Mapping

| Step | User Action | Table Impact |
|------|-------------|--------------|
| 1️⃣ | Admin creates accounts | Insert → Interviewer / Candidate |
| 2️⃣ | Interviewer logs in | Read → Interviewer table |
| 3️⃣ | Interviewer sets availability | Insert → Availability |
| 4️⃣ | Auto slot generation | Insert multiple → Slot(status=AVAILABLE) |
| 5️⃣ | Candidate views open slots | Read → Slot where status=AVAILABLE |
| 6️⃣ | Candidate books slot | Insert → Booking + Update Slot(status=BOOKED) |
| 7️⃣ | Slot hidden from others | Filter slot status |
| 8️⃣ | Interviewer views bookings | Join → Slot + Booking + Candidate |
| 9️⃣ | Status update | Update Booking + Slot |
| 🔟 | Admin monitors system | Full Read access |

---

## 📂 Project Structure

```bash
InterviewScheduler/
│── frontend/                       # Frontend application (Next.js)
│
└── interviewscheduler/             # Backend (Spring Boot)
    │── .mvn/
    │── build/
    │── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/interviewscheduler/
    │       │       ├── config/        # CORS, Security config
    │       │       ├── controller/    # REST controllers
    │       │       ├── dto/           # DTO classes
    │       │       ├── model/         # JPA Entities
    │       │       ├── repository/    # JpaRepository interfaces
    │       │       └── service/       # Core business logic
    │       │
    │       └── resources/
    │           ├── application.properties
    │           └── static/templates
    │
    │── test/                          # Unit tests
    │── mvnw / mvnw.cmd                # Maven wrapper
    │── pom.xml                        # Dependencies
    │── .env                           # Environment variables
    │── .gitignore
