📝 Feedback Collection Platform
A full-stack web application to create, share, and analyze feedback forms. Built using Node.js, Express, MongoDB, and EJS, this platform allows admins to design dynamic forms with various question types and collect structured responses from users.

🔗 Live Demo: 
You can visit https://feedback-collector-1fpo.onrender.com/ to check out the live Feedback Collection Platform in action.

📸 Screenshots
First page
<img width="1911" height="925" alt="Screenshot 2025-07-19 110323" src="https://github.com/user-attachments/assets/7f8df3de-30d2-4cba-93be-c1ad772a4e1b" />
Dashboard
<img width="1878" height="931" alt="Screenshot 2025-07-19 110413" src="https://github.com/user-attachments/assets/1d91804f-9992-4127-8337-0d7e41303446" />
Create form
<img width="1875" height="934" alt="Screenshot 2025-07-19 110446" src="https://github.com/user-attachments/assets/314ce7e7-dc69-496e-adcd-5056e0a6bf7d" />
UI for form submit
<img width="1878" height="927" alt="Screenshot 2025-07-19 110600" src="https://github.com/user-attachments/assets/05fa2609-d6c0-43a9-8151-465fe36460d3" />

🚀 Features
👤 Admin
Signup / Login (JWT Authentication)
Create feedback forms with multiple question types:
Edit existing forms (add/remove questions)
View responses in:
  Tabular format (per submission)
  Export responses (CSV)

🙋‍♂️ Users
Access forms via public URLs
Submit feedback easily

🛠️ Tech Stack
| Tech       | Usage                  |
| ---------- | ---------------------- |
| Node.js    | Backend runtime        |
| Express.js | Web framework          |
| MongoDB    | NoSQL database         |
| Mongoose   | MongoDB ODM            |
| EJS        | Server-side templating |
| JWT        | Authentication         |
| Bcrypt     | Password hashing       |
| CSS        | Custom styling         |


🚀 How to Run This Project Locally
Follow the steps below to clone and run the Feedback Collector app on your local machine.

📦 Prerequisites
Make sure you have these installed:
Node.js (v16+ recommended)
MongoDB (local or Atlas cloud)
Git (for cloning)
A code editor (e.g., VS Code)

🛠️ Step 1: Clone the Repository
git clone https://github.com/grv1831/Feedback_collector.git
cd Feedback_collector

📂 Step 2: Install Dependencies
npm install

🔑 Step 3: Set Up Environment Variables
Create a .env file in the root directory:
Then add the following:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/feedback_collector
JWT_SECRET=your_jwt_secret_key

▶️ Step 4: Run the App
npm start
The server will start on: http://localhost:3000

🔐 Admin Authentication
Only registered admins can log in and create/edit forms.
Customers can fill forms via a public link.

🔐 Admin Registration
To create an admin account, you must enter a Secret Admin Code during signup. This ensures only authorized users can create and manage feedback forms.
Admin Secret Code: aynaplease
🛡️ This prevents unauthorized access to the admin dashboard.

✨ Usage
Visit http://localhost:3000
Register as an Admin
Create your form by adding different types of questions
Share the form link with users
Track and analyze feedback through your dashboard

🤝 Contributing
Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.


