var getUserRepos = function (user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    // .then() callback fx captures data from promise obj
    // make a get request to the url
    fetch(apiUrl)
    .then(function (response) {
        // request was successfull
        if (response.ok) {
            // .json() parses response as JSON
            response.json().then(function (data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    // Fetch API handle network errors
    .catch(function(error) {
        //  `.catch()` is chained to the end of the `.then()` method
        alert("Unable to connect to GitHub");
    });
};

// user form
var userFormEl = document.querySelector("#user-form");
// their input
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var formSubmitHandler = function (event) {
    event.preventDefault();
    // get value from input element, trim leading or trailing spaces
    var username = nameInputEl.value.trim();

    if (username) {
        // if value to username, pass to getUserRepos() and clear form
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

var displayRepos = function (repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }

    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over user's repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        // create a container for each repo, style
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

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
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            // display blue check mark
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to DOM
        repoContainerEl.appendChild(repoEl);
    }
}


userFormEl.addEventListener("submit", formSubmitHandler);

