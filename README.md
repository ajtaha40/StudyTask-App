# StudyTask App

StudyTask App is a simple web-based task manager made to help students organise and keep track of their study tasks.

## Project Development

This project was developed in **three versions** to show how the application improved step by step.

### Version 1
Version 1 focused on the main task manager functions. In this version, the user can:
- add tasks
- view tasks in a list
- mark tasks as completed
- edit tasks
- delete tasks

### Version 2
Version 2 added more useful task management features to improve the app. In this version, the user can:
- add a due date to each task
- set a priority level (Low, Medium, High)
- search for tasks by name
- filter tasks by status
- use an improved interface compared to Version 1

### Version 3
Version 3 added the final improvements to make the app more complete and more user-friendly. In this version, the user can:
- switch between light mode and dark mode
- view a dashboard summary showing total, completed, and incomplete tasks
- log in with a simple username
- save personal task progress in the browser using localStorage

The final version also includes:
- automated testing with Jest
- GitHub Actions for continuous integration
- deployment using Netlify

## Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- Jest
- jsdom
- GitHub Actions
- Netlify

## Project Structure

```text
StudyTask-App/
│
├── index.html
├── style.css
├── script.js
├── server.js
│
├── tests/
│   └── script.test.js
│
├── .github/
│   └── workflows/
│       └── test.yml
│
├── package.json
├── package-lock.json
├── jest.config.js
├── .gitignore
└── README.md]

## How to Run the Project

1. Clone the repository:

git clone https://github.com/ajtaha40/StudyTask-App.git

2. Open the project folder:

cd StudyTask-App

3. Open index.html in your browser.

## Running Tests

Install dependencies first:

npm install

Then run the tests:

npm test

## Live Demo

The project is deployed on Netlify:

https://dapper-salamander-f066f4.netlify.app/

## Main Features
- add, edit, complete, and delete tasks
- due date and priority levels
- search and filtering
- dashboard summary
- dark mode
- simple login / user profile
- automated testing
- GitHub Actions workflow

## Future Improvements
Possible future improvements for the app could include:
- secure user authentication
- database support
- reminders and notifications
- task sharing between users
- mobile-friendly version

## Team Members
- Taha Ajmi
- Alejandro Ayala Alvis
- Abigail Foteh
- Ayush Shrestha
- Anush Shrestha

## Note
This project was developed for educational purposes as part of Assessment 2.
