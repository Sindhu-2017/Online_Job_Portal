create database externalassessment
use externalassessment


CREATE TABLE users
(	
	ID INT PRIMARY KEY IDENTITY(1,1),
	Fullname VARCHAR(50) NOT NULL,
	Email VARCHAR(30) UNIQUE NOT NULL,
	Phone VARCHAR(10) UNIQUE NOT NULL,
	DateOfBirth Date NOT NULL,
	Gender VARCHAR(6) NOT NULL,
	Role VARCHAR(10) CHECK(Role IN('Recruiter','Applicant')),
	Password VARCHAR(20) NOT NULL,
	Status VARCHAR(10) CHECK(Status IN('Active','Inactive'))
);

CREATE TABLE recruiter
(
	ID INT PRIMARY KEY IDENTITY(1,1),
	UserID INT UNIQUE NOT NULL,
	Role VARCHAR(10) CHECK(Role='Recruiter'),
	CompanyName VARCHAR(50) NOT NULL,
	CompayLocation VARCHAR(50) NOT NULL,
	FOREIGN KEY (UserID) REFERENCES users(ID) ON DELETE CASCADE
);

CREATE TABLE applicant
(
	ID INT PRIMARY KEY IDENTITY(1,1),
	UserID INT UNIQUE NOT NULL,
	Role VARCHAR(10) CHECK(Role='Applicant'),
	Qualification VARCHAR(50) NOT NULL,
	Experience INT NOT NULL,
	FOREIGN KEY (UserID) REFERENCES users(ID) ON DELETE CASCADE
);

CREATE TABLE jobs
(
	ID INT PRIMARY KEY IDENTITY(1,1),
	CompanyName VARCHAR(50) NOT NULL,
	CompanyLocation VARCHAR(50) NOT NULL,
	JobTitle VARCHAR(50) NOT NULL,
	Description VARCHAR(50) NOT NULL,
	Salary DECIMAL(10,2) NOT NULL,
	JobType VARCHAR(10) CHECK(JobType IN('FullTime','PartTime')),
	RecruiterID INT FOREIGN KEY REFERENCES recruiter(ID) ,
	PostedDate DATE DEFAULT GETDATE(),
	ClosingDate Date NOT NULL,
	Status VARCHAR(10) CHECK(Status IN('Active','Inactive')),
	IsDeleted BIT DEFAULT 0
);

CREATE TABLE applications
(
	ID INT PRIMARY KEY IDENTITY(1,1),
	JobID INT FOREIGN KEY REFERENCES jobs(ID),
	ApplicantID INT FOREIGN KEY REFERENCES applicant(ID),
	AppliedDate DATE DEFAULT GETDATE(),
	ApplicationStatus VARCHAR(20) CHECK(ApplicationStatus IN ('Called For Interview','ShortListed','Selected','Rejected'))
);

--INDEXES
CREATE INDEX IDX_JOBTITLE
ON jobs(JobTitle)

CREATE INDEX IDX_JOBTYPE
ON jobs(JobType)

CREATE INDEX IDX_SALARY
ON jobs(Salary)

CREATE INDEX IDX_company
ON jobs(CompanyName)

CREATE INDEX IDX_Location
ON jobs(CompanyLocation)

CREATE INDEX IDX_COMPLOCATION
ON jobs(CompanyName,CompanyLocation)

CREATE INDEX IDX_JOBS
ON jobs(JobTitle) INCLUDE(CompanyName,CompanyLocation)

CREATE INDEX IDX_POSTDATE
ON jobs(PostedDate)


--sample insertions
INSERT INTO users (Fullname, Email, Phone, DateOfBirth, Gender, Role, Password, Status) VALUES
('Sindhuja Rajan', 'sindhuja@email.com', '9876543210', '1995-04-12', 'Female', 'Recruiter', 'pass123', 'Active'),
('Arun Kumar', 'arun.k@email.com', '9876543211', '1988-11-23', 'Male', 'Recruiter', 'secure456', 'Active'),
('Meera Pillai', 'meera@email.com', '9876543212', '1992-07-05', 'Female', 'Recruiter', 'meera2026', 'Inactive'),
('Rahul Sharma', 'rahul.s@email.com', '9123456780', '1998-01-15', 'Male', 'Applicant', 'rahul98', 'Active'),
('Priya Patel', 'priya.p@email.com', '9123456781', '2000-09-30', 'Female', 'Applicant', 'priya2000', 'Active'),
('Amit Verma', 'amit.v@email.com', '9123456782', '1996-05-18', 'Male', 'Applicant', 'amitpass', 'Active');

-- Profiles for the Recruiters (UserIDs: 1, 2, 3)
INSERT INTO recruiter (UserID, Role, CompanyName, CompayLocation) VALUES
(1, 'Recruiter', 'TechCorp Solutions', 'Bangalore'),
(2, 'Recruiter', 'Innovate Edge LLC', 'Mumbai'),
(3, 'Recruiter', 'Global Talents', 'Chennai');

-- Profiles for the Applicants (UserIDs: 4, 5, 6)
INSERT INTO applicant (UserID, Role, Qualification, Experience) VALUES
(4, 'Applicant', 'B.Tech Computer Science', 3),
(5, 'Applicant', 'MCA', 1),
(6, 'Applicant', 'B.Sc Information Technology', 5);

INSERT INTO jobs (CompanyName, CompanyLocation, JobTitle, Description, Salary, JobType, RecruiterID, PostedDate,ClosingDate, Status, IsDeleted) VALUES
('TechCorp Solutions', 'Bangalore', 'Software Engineer', 'Looking for a backend developer proficient in SQL.', 85000.00, 'FullTime', 1, '2026-06-11','2026-06-23' ,'Active', 0),
('TechCorp Solutions', 'Bangalore', 'Database Administrator', 'Expertise in database design and indexing needed.', 95000.00, 'FullTime', 1, '2026-06-12','2026-06-23' , 'Active', 0),
('Innovate Edge LLC', 'Mumbai', 'Frontend Developer', 'UI/UX development using modern JS frameworks.', 70000.00, 'FullTime', 2, '2026-06-15','2026-06-23' , 'Active', 0),
('Innovate Edge LLC', 'Mumbai', 'Data Analyst Intern', 'Data cleaning and basic reporting dashboard help.', 25000.00, 'PartTime', 2, '2026-06-18','2026-06-23' , 'Active', 0),
('Global Talents', 'Chennai', 'HR Executive', 'End to end recruitment pipeline processing.', 45000.00, 'FullTime', 3, '2026-06-19', '2026-06-23' ,'Inactive', 0);


INSERT INTO applications (JobID, ApplicantID, AppliedDate, ApplicationStatus) VALUES
(1, 1, '2026-06-12', 'ShortListed'),                                -- Rahul applying for Software Engineer
(2, 3, '2026-06-14', 'Called For Interview'),                       -- Amit applying for DBA
(1, 2, '2026-06-16', 'ShortListed'),                                -- Priya applying for Software Engineer
(3, 2, '2026-06-17', 'Selected'),                                    -- Priya applying for Frontend Developer
(4, 1, '2026-06-20', 'Rejected');                                 -- Rahul applying for Data Analyst Intern


--1. Display all records

SELECT Fullname,Email,Phone,DateOfBirth,Gender,Role,Status FROM users


SELECT R.UserID,U.Fullname,U.Email,U.Phone,R.CompanyName,R.CompayLocation FROM recruiter R
JOIN users U
ON R.UserID = U.ID
WHERE U.Role = 'Recruiter'

SELECT A.UserID,U.Fullname,U.Email,U.Phone,U.Gender,A.Experience,A.Qualification FROM applicant A
JOIN users U
ON A.UserID = U.ID
WHERE U.Role = 'Applicant'

SELECT JobTitle,CompanyName,CompanyLocation,Description,Salary,JobType,PostedDate,Status FROM jobs

SELECT JobID,ApplicantID,AppliedDate,ApplicationStatus FROM applications



--2. Display active records
SELECT Fullname,Email,Phone,DateOfBirth,Gender,Role,Status FROM users WHERE Status='Active'

SELECT JobTitle,Description,Salary,JobType,PostedDate,Status FROM jobs WHERE Status='Active'

--3. Display inactive records
SELECT Fullname,Email,Phone,DateOfBirth,Gender,Role,Status FROM users WHERE Status='Inactive'

SELECT JobTitle,Description,Salary,JobType,PostedDate,Status FROM jobs WHERE Status='Inactive'


--4. Search by name
SELECT Fullname,Email,Phone,DateOfBirth,Gender,Role,Status FROM users WHERE Fullname ='Sindhuja Rajan'

--5. Count total records
SELECT COUNT(*) AS usercount FROM users

SELECT COUNT(*) AS applicantcount FROM applicant

SELECT COUNT(*) AS recruitercount FROM recruiter

SELECT COUNT(*) AS jobscount FROM jobs

SELECT COUNT(*) AS applicationscount FROM applications

--6. Count records by status
SELECT COUNT(*) activeusers FROM users WHERE Status='Active'

SELECT COUNT(*) activejobs FROM jobs WHERE Status='Active'

SELECT COUNT(*) inactiveusers FROM users WHERE Status='Inactive'

SELECT COUNT(*) inactivejobs FROM jobs WHERE Status='Inactive'


--7. Display recently added records

SELECT TOP 5 * FROM jobs
ORDER BY PostedDate DESC

SELECT TOP 5 * FROM applications
ORDER BY AppliedDate DESC

--8. Display records within date range
SELECT * FROM jobs WHERE PostedDate BETWEEN '2026-06-10' AND '2026-06-20'

SELECT * FROM applications WHERE AppliedDate BETWEEN '2026-06-10' AND '2026-06-20'


--9. Display top 5 records
SELECT TOP 5* FROM jobs
ORDER BY Salary DESC

--10. Display summary report
CREATE VIEW USER_VIEW
AS
SELECT Fullname,Email,Phone,DateOfBirth,Gender,Role,Status FROM users;

CREATE VIEW RECRUITER_VIEW
AS
SELECT R.UserID,U.Fullname,U.Email,U.Phone,R.CompanyName,R.CompayLocation FROM recruiter R
JOIN users U
ON R.UserID = U.ID
WHERE U.Role = 'Recruiter';


CREATE VIEW APPLICANT_VIEW
AS
SELECT A.UserID,U.Fullname,U.Email,U.Phone,U.Gender,A.Experience,A.Qualification FROM applicant A
JOIN users U
ON A.UserID = U.ID
WHERE U.Role = 'Applicant';

CREATE VIEW JOBS_VIEW
AS
SELECT JobTitle,CompanyName,CompanyLocation,Description,Salary,JobType,PostedDate,Status FROM jobs 

CREATE VIEW APPLICATION_VIEW
AS
SELECT u.Fullname,u.Email,u.Phone,a1.Qualification,a1.Experience,
j.JobTitle,j.JobType,j.Salary,a.AppliedDate,a.ApplicationStatus FROM applications a
JOIN applicant a1
ON a.ApplicantID=a1.ID
JOIN users u
ON a1.UserID=u.ID
JOIN jobs j
ON a.JobID=j.ID

SELECT * FROM USER_VIEW
SELECT * FROM RECRUITER_VIEW
SELECT * FROM APPLICANT_VIEW
SELECT * FROM JOBS_VIEW
SELECT * FROM APPLICATION_VIEW


-- for soft delete
UPDATE jobs SET IsDeleted = 1 where ID = 5
SELECT * FROM jobs

SELECT * FROM users
SELECT * FROM applicant
SELECT * FROM recruiter
SELECT * FROM applications



