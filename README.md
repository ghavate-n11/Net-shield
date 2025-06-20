# 🚨 NetShield

**Network Sniffing & Security Analyzer**

Real-time, web-based network traffic monitoring and security analysis tool built with **Spring Boot**, **React.js**, and **MySQL**.

---

## 🎯 Motto

> “See the unseen. Secure the unknown.”  
Empowering users with real-time visibility into their network to detect and thwart cyber threats before they strike.

---

## 🧠 Why NetShield?

Organizations often lack deep insight into internal network traffic—especially stealthy, malicious behavior. NetShield solves that by:

- Providing **live packet monitoring**
- Detecting **suspicious IP activity**
- Offering a **user-friendly dashboard** for swift analysis and action

Ideal for developers, sysadmins, and cybersecurity learners.

---

## 🚀 What Makes NetShield Unique?

- **Web-based simplicity** – monitor and analyze your network via browser
- **Smart pattern detection** – early recognition of unusual behaviors
- **Interactive dashboards** – charts, IP logs, stats at a glance
- **Full-stack native** – integrated Spring Boot, React, MySQL architecture
- **Developer-centric** – clean, modular, extendable codebase

---

## 📦 Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| **Frontend** | React.js, Axios         |
| **Backend**  | Java (Spring Boot), Maven |
| **Database** | MySQL                   |
| **APIs & Deployment** | REST, Git           |

---

## ✨ Key Features

- 🔍 **Real‑Time Packet Monitoring**  
- 🚨 **Suspicious IP Detection**  
- 🛡️ **Threat Pattern Analysis**  
- 💾 **Secure MySQL Data Storage**  
- 👤 **Admin & User‑Friendly UI**  
- 📊 **Visual Dashboards & Analytics**

---

## ⚙️ Getting Started

### 1. Clone Repositories
```bash
git clone https://github.com/ghavate-n11/netshield-backend.git backend
git clone https://github.com/ghavate-n11/Netshild-.git frontend
````

### 2. Run Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

* Update `src/main/resources/application.properties` with your MySQL credentials.

### 3. Run Frontend (React)

```bash
cd frontend
npm install
npm start
```

* Access:

  * Frontend UI — [http://localhost:3000](http://localhost:3000)
  * Backend API — [http://localhost:8080](http://localhost:8080)

📌 **Note:** Frontend is currently under active development—UI/UX enhancements in progress.

---

## 📁 Project Structure

```
netshield/
├── backend/        # Java Spring Boot backend (REST API, services, JPA repos)
│   ├── src/main/java/com/yourorg/netshield/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── service/
│   │   └── repository/
│   └── src/main/resources/      # MySQL config + static content storage
└── frontend/       # React frontend
    ├── public/     # Static index.html
    └── src/
        ├── components/         # UI widgets (tables, dashboards)
        ├── services/           # Axios API logic
        ├── pages/              # Views (Dashboard, Settings)
        ├── router.jsx          # React Router setup
        ├── App.jsx
        └── index.jsx
```

---

## ⚙️ Production Build & Deployment

1. Build React app:

```bash
cd frontend
npm run build
```

2. Copy `build/` output into `backend/src/main/resources/static/`.
3. Run Maven package:

```bash
cd backend
./mvnw clean package
java -jar target/netshield-0.0.1-SNAPSHOT.jar
```

This bundles both backend and frontend into a single deployable JAR ([github.com][2], [github.com][3], [baeldung.com][4]).

---

## 🚧 Roadmap & Upcoming Features

* 🔐 JWT-based authentication
* 📱 Mobile-responsive UI
* 🌐 Cloud deployment (Heroku, Render, Netlify)
* 🧠 AI/ML-powered intrusion detection
* 🛠 CLI export & rule generation
* 🔄 Persistent state via localStorage
* 🔧 Configurable rule sets, user roles

---

## 🤝 Contributors

| Name                 | Role                                |
| -------------------- | ----------------------------------- |
| 👨‍💻 Nilesh Ghavate | Full‑Stack Developer (Java + React) |
| 🎓 Varnan Sir        | Project Guide & Technical Mentor    |

---

## 🙋‍♂️ Connect with the Author

* 📧 [nileshghavate11@gmail.com](mailto:nileshghavate11@gmail.com)
* 🔗 [LinkedIn](https://linkedin.com/in/nileshghavate-203b27251)
