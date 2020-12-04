const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlrender");

const writeFileAsync = util.promisify(fs.writeFile);

// Set the intital Team members array to an empty array
const myTeamMembers = [];

// Constants to make sure all the spellings of each employee type is consistent 
const ENGINEER = "Engineer";
const MANAGER = "Manager";
const INTERN = "Intern";

// Method to create Employees
const createEmployees = async (inputs = []) => {

  // Array of all the questions to ask in the prompt
  const employeeQuestions = [
    {
      type: `input`,
      name: `name`,
      message: "What is your name:",
    },
    {
      type: "input",
      name: "id",
      message: "What is your ID?",
    },
    {
      type: "input",
      name: "email",
      message: "What is your email?",
    },
    {
      type: "list",
      name: "employeeType",
      message: "What is your employement status?",
      choices: [ENGINEER, MANAGER, INTERN],
      default: MANAGER,
    },
    {
      type: "input",
      name: "officeNumber",
      message: "What is your office number?",
      when: (answers) => answers.employeeType === MANAGER,
    },
    {
      type: "input",
      name: "gitHubuser",
      message: "What is your GitHub user name?",
      when: (answers) => answers.employeeType === ENGINEER,
    },
    {
      type: "input",
      name: "school",
      message: "What is your school?",
      when: (answers) => answers.employeeType === INTERN,
    },
    {
      type: 'confirm',
      name: 'again',
      message: 'Would you like to add another employee? ',
      default: true
    }
  ];

  // Destructuring to separate the confirmation answer from answers
  const {again, ...answers} = await inquirer.prompt(employeeQuestions);

  // Merge new answers with existing answers
  const newAnswers = [...inputs, answers];

  return again ? createEmployees(newAnswers) : newAnswers;
}


// function to initialize program
async function init() {
  try {
    await createEmployees().then((response) => {

      // Loop over each response and create new employee types based off the response.
      response.forEach((item) => {

        // Destructuring to grab the individual values from the item object
        const {employeeType, name, id, email, officeNumber, gitHubuser, school} = item;

        // Check the employee type in order create the correct one and push to myTeamMembers array
        switch(employeeType) {
          case MANAGER:
            const manager = new Manager(name, id, email, officeNumber);
            myTeamMembers.push(manager);
            break;
  
          case ENGINEER:
            const engineer = new Engineer(name, id, email, gitHubuser);
            myTeamMembers.push(engineer);
            break;
  
          case INTERN:
            const intern = new Intern(name, id, email, school);
            myTeamMembers.push(intern);
            break;

          default:
            console.log('This employee type does not exisit');
        }
        
      })  
    });

    // Push the rendered HTML to the teamHTML
    const teamHTML = render(myTeamMembers);

    // Write the file to the path set above with the rendered HTML
    writeFileAsync(outputPath, teamHTML);

  } catch (err) {
    console.log(err);
  }
}

// function call to initialize program
init();

// class def. for intern and engineer - write functions that asks user type of employee  to create

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
