# folder structure

```
HireHub/
│
+-----assets/
│     +---images/
│         +---jobportal.jpg
│
+-----pages/
│   +--- signup.html
│   +---applicant_dashboard.html
│   +--- recruiter_dashboard.html
│
+-----scripts/
│   +--- config.js
│   +--- index.js
│   +--- signup.js
│   +--- applicant_dashboard.js
│   +--- recruiter_dashboard.js
│
+-----styles/
│   +--- index.css
│   +--- signup.css
│   +--- applicant_dashboard.css
│   +--- recruiter_dashboard.css
│
+-----json/
|     +--- db.json
|  
|
+----- index.html
+----- README.md
+-----Jobportal.sql
```

# How to Run the Project

### Step 1: Download the Project

* Clone the repository using Git or download the ZIP file.
* Extract the project folder.

### Step 2: Open the Project

* Open the project folder in **Visual Studio Code**.

### Step 3: Install JSON Server

Open the terminal and run:

   npm install -g json-server


### Step 4: Start the JSON Server

Run the following command from the project folder:

   json-server --watch db.json

The server will start at:

   http://localhost:3000


### Step 5: Open the Website

* Install the **Live Server** extension in Visual Studio Code (if not already installed).
* Right-click **index.html**.
* Select **Open with Live Server**.

The project will open in your default browser.

### Step 6: Use the Application

* Register as an Applicant or Recruiter.
* Log in with your registered credentials.
* Recruiters can post and manage jobs.
* Applicants can browse and apply for jobs.
* Track application status through the respective dashboards.



# Project Flow

1. **Landing Page**

   * User visits the HireHub homepage.
   * User can log in or register as an Applicant or Recruiter.

2. **User Registration**

   * New users register by selecting their role.
   * Applicant and Recruiter have different registration fields.
   * User details are stored in the JSON Server database.

3. **User Login**

   * User enters email and password.
   * Credentials are validated.
   * Based on the selected role, the user is redirected to the appropriate dashboard.

4. **Recruiter Module**

   * Recruiter posts new job openings.
   * Recruiter can edit, delete, and restore job postings.
   * Recruiter views applicants who applied for jobs.
   * Recruiter updates application status (Shortlisted, Selected, Rejected, or Called for Interview).

5. **Applicant Module**

   * Applicant views available jobs.
   * Searches and filters jobs.
   * Applies for suitable jobs.
   * Tracks application status through the dashboard.

6. **Account Management**

   * Users can view their profile information.
   * Users can activate/deactivate their account.
   * Users can switch between Light and Dark themes.
   * Users can securely log out of the application.


# Index Page

## Overview

The Index Page is the landing page of the HireHub Job Portal. It allows users to log in, register, switch between light and dark themes, and learn about the portal through feature cards and FAQs.

### Features

* Responsive Navigation Bar
* Login Modal
* Signup Navigation
* Hero Section
* Feature Cards
* FAQ Section
* Dark/Light Theme
* Responsive Design

### Technologies Used

* HTML
* CSS
* Bootstrap 
* JavaScript
* jQuery
* SweetAlert
* JSON Server

---

# Signup Page

## Overview

The Signup Page allows Applicants and Recruiters to create an account with role-based registration and form validation.

### Features

* User Registration
* Role-based Form
* Form Validation
* Password Confirmation
* Age Validation (18+)
* Skills Selection
* Dark Theme
* Responsive Design

### Technologies Used

* HTML
* CSS
* Bootstrap 
* JavaScript
* jQuery
* SweetAlert
* JSON Server

---

# Applicant Dashboard

## Overview

The Applicant Dashboard enables users to browse jobs, apply for jobs, track application status, and manage their account.

### Features

* View Available Jobs
* Apply for Jobs
* Search & Date Filter
* Applied Jobs
* Application Statistics
* Pagination
* My Account
* Account Deactivation
* Dark Theme
* Logout

### Technologies Used

* HTML
* CSS
* Bootstrap
* JavaScript
* Fetch API
* SweetAlert
* JSON Server

---

# Recruiter Dashboard

## Overview

The Recruiter Dashboard allows recruiters to post jobs, manage job listings, review applications, and update applicant status.

### Features

* Post New Job
* Edit Job
* Delete & Restore Jobs
* View Applications
* Update Application Status
* Search & Date Filter
* Dashboard Statistics
* Pagination
* My Account
* Dark Theme
* Logout

### Technologies Used

* HTML
* CSS
* Bootstrap 
* JavaScript
* Fetch API
* SweetAlert
* JSON Server
