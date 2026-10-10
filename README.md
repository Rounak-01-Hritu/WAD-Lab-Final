# WAD-Lab-Final
# Student Complaint Service System

A web-based application that helps students submit and track complaints while allowing administrators to manage complaints efficiently through a centralized platform.

## 🌐 Live Website

**[Visit Student Complaint Service System](https://wad-lab-final.onrender.com/index.html)**

## 📌 Project Overview

The Student Complaint Service System is a full-stack web application developed as a Web Application Development Lab project. It provides students with an organized way to report concerns and enables administrators to review complaints, monitor progress, and update complaint statuses.

## ✨ Features

### Student Features
- Student registration and login
- Student dashboard
- Submit complaints with subject, category, priority, and description
- View submitted complaints and their statuses
- View profile information
- Secure logout

### Admin Features
- Admin dashboard with complaint statistics
- View and manage submitted complaints
- Search complaints by subject or student email
- Filter complaints by status and category
- Update complaint status: Pending, In Progress, or Resolved

## 🛠️ Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** bcrypt and express-session
- **Deployment:** Render
- **Version Control:** Git and GitHub

## ⚙️ Application Workflow

1. Students register or log in.
2. Students submit complaints through the complaint form.
3. Complaint information is stored in MongoDB.
4. Students can view their submitted complaints and current statuses.
5. Administrators review complaints and update their statuses.

## 🔐 Security

- Passwords are hashed using bcrypt.
- Session-based authentication is used to maintain login state.
- Environment variables are used to configure sensitive settings.

## 🚀 Future Improvements

- Email notifications for complaint status updates
- File attachments for supporting evidence
- More detailed complaint reports and analytics
- Further security and accessibility improvements

## 👩‍💻 Developer

Developed as a Web Application Development Lab project.

## 📄 License

This project was developed for educational purposes.
