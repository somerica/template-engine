//TODO: Write code to define and export the engineer class.
const Employee = require("./Employee");

class Engineer extends Employee {
  constructor(name, id, email, gitHubuser) {
    super(name, id, email);
    this.gitHubuser = gitHubuser;
  }
  getRole() {
    return "Engineer";
  }
  getGithubuser() {
    return this.gitHubuser;
  }
}
module.exports = Engineer;
