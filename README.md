# Application Tracker

This is a simple application tracker to help keep track of job applications. 

## Features

- Add new applications with details such as company name, position, and application date.
- Track the status of each application (e.g., applied, interview scheduled, offer received, rejected).
- Set reminders for follow-ups and interviews.
- View a summary of your application history and status.
- View your current application statisitics.

## Installation

1. Clone this repository to your local machine.
2. Open the terminal and navigate to the project directory Ex. `cd .\internship-tracker\`
3. Run `npm install` to install the required dependencies.
4. As I currently am not hosting this on any cloud service or using MongoDB Atlas, you will have to set up your own mongodb database, refer to Database Setup.
5. Run `npm start` to start the application.

## Database Setup
1. Install MongoDB: If you haven't already, install MongoDB on your system. You can download it from the MongoDB website and follow the installation instructions for your operating system.

2. Start MongoDB: After installation, start the MongoDB service. On most systems, you can start MongoDB using the command mongod.

3. Create a Database: Open a MongoDB client (like MongoDB Compass or the MongoDB shell) and create a new database for your application. You can use a command like use internshipTracker in the MongoDB shell to switch to a new database named internshipTracker. Replace internshipTracker with your desired database name.

4. Establish Connection: To establish connection, in line 13 of internship-tracker/app.js replace the connection url to the connection to your database. It will be similar to `mongodb://localhost:27017/internshipTracker`

## Usage

1. Open the application in your web browser.
2. Click on the "Add Application" button to add a new application.
3. Fill in the required details and click "Save".
4. Use the "Update" and "Delete" buttons to manage your applications.
5. Use the "Filter" option to view applications based on their status.
6. Set reminders for follow-ups and interviews by clicking on the respective application.
7. View the summary of your application history and status on the dashboard.

