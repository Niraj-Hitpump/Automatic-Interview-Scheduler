# 🤖 Automatic Interview Scheduler

A production-ready Interview Scheduling Application built using **Java Spring Boot**, **Next.js (React)**, and **MySQL** that automates end-to-end interview booking between candidates and interviewers.

✔ Availability → ✔ Smart Slot Generation → ✔ Candidate Booking → ✔ Status Sync → ✔ Completion Tracking.

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

## 🗄️ Database Structure — Entity & Relationships

The database ensures that interview scheduling, availability updates, and booking statuses remain synchronized across users.

---

### 🧑‍💼 Interviewer Table

| Column | Type | Description |
|--------|------|-------------|
| id (PK) | BIGINT | Unique interviewer ID |
| name | VARCHAR | Interviewer’s full name |
| email | VARCHAR | Login credential + communication |
| password | VARCHAR | Encrypted login password |

> ✔ One interviewer can create multiple availability slots.

---

### 👤 Candidate Table

| Column | Type | Description |
|--------|------|-------------|
| id (PK) | BIGINT | Unique candidate ID |
| name | VARCHAR | Candidate’s full name |
| email | VARCHAR | Login credential + communication |
| password | VARCHAR | Encrypted login password |

> ✔ One candidate may book exactly one slot at a time.

---

### 🗓️ Availability Table

| Column | Type | Description |
|--------|------|-------------|
| id (PK) | BIGINT | Availability record ID |
| interviewer_id (FK) | BIGINT → Interviewer | Who is available |
| date | DATE | Day of availability |
| total_slots | INT | Max no. of slots interviewer created |
| remaining_slots | INT | Decreases when booking happens |

> ✔ One availability generates multiple time slots.

---

### ⏱️ Slot Table

| Column | Type | Description |
|--------|------|-------------|
| id (PK) | BIGINT | Unique time slot ID |
| availability_id (FK) | BIGINT → Availability | Slots grouped per day |
| start_time | TIME | Start time of interview |
| end_time | TIME | End time of interview |
| is_booked | BOOLEAN | Live slot booking status |

> ✔ A slot can be booked only once.

---

### 📍 Booking Table

| Column | Type | Description |
|--------|------|-------------|
| id (PK) | BIGINT | Unique booking ID |
| candidate_id (FK) | BIGINT → Candidate | Who booked |
| slot_id (FK) | BIGINT → Slot | Which slot reserved |
| status | ENUM('BOOKED', 'COMPLETED', 'CANCELLED') | Booking lifecycle |

> ✔ When a booking is made, Availability + Slot both update automatically.

---

## 🔄 Data Flow — Auto Updates Between Tables

| Action | Database Changes | System Effect |
|--------|-----------------|---------------|
| Interviewer sets availability | Insert into Availability & Slot | Slots appear to candidates |
| Candidate books a slot | Insert Booking → Slot.is_booked = true | Availability.remaining_slots -1 |
| Candidate cancels booking | Update Booking.status | Slot.is_booked = false → remaining_slots +1 |
| Interview completed | Update Booking.status | Slot remains locked (history retained) |

---

## 🔗 Database Relationship Overview

| Table | Relationship | Table |
|-------|-------------|------|
| Interviewer | 1 → Many | Availability |
| Availability | 1 → Many | Slot |
| Slot | 1 → 1 | Booking |
| Candidate | 1 → 1 | Booking |

---

### ✔ Slot Booking Cascade (Quick Example)

When Candidate books a slot:



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
