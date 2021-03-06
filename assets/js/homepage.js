var userFormEl = document.querySelector("#user-form");
var languageButtonsEl = document.querySelector("#language-buttons");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function (event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element, trim leading or trailing spaces
  var username = nameInputEl.value.trim();

  if (username) {
    // if value to username, pass to getUserRepos() and clear form
    getUserRepos(username);

    // clear old content
    repoContainerEl.textContent = "";
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
};

// browser's event object has target property that
// tells us which HTML element was interacted with to create event
var buttonClickHandler = function (event) {
  // get language attribute form clicked element
  var language = event.target.getAttribute("data-language");

  if (language) {
    getFeaturedRepos(language);

    // clear old content, executes first bc getFeaturedRepos() is asynchronous
    repoContainerEl.textContent = "";
  }
};

var getUserRepos = function (user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a get request to the url
  fetch(apiUrl)
    // .then() callback fx captures data from promise obj
    .then(function (response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        // .json() parses response as JSON
        response.json().then(function (data) {
          console.log(data);
          displayRepos(data, user);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    // Fetch API handle server network errors
    .catch(function (error) {
      //  `.catch()` is chained to the end of the `.then()` method
      alert("Unable to connect to GitHub");
    });
};

var getFeaturedRepos = function (language) {
  // format GitHub API URL
  var apiUrl =
    "https://api.github.com/search/repositories?q=" +
    language +
    "+is:featured&sort=help-wanted-issues";

  // make a get request to URL
  fetch(apiUrl).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, language);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

var displayRepos = function (repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }
  repoSearchTerm.textContent = searchTerm;

  // loop over user's repos
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a link for each repo
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create span element to hold repo name
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;

    // append to div container
    repoEl.appendChild(titleEl);

    // create issues status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      // display number of issues and add red X icon
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      // display blue check mark
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to DOM
    repoContainerEl.appendChild(repoEl);
  }
};

// add event lister to form and button container
userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);
