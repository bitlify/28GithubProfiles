const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username);
        createUserCard(data);
        getRepos(username);
    } catch (err) {
        if (err.response.status == 404) {
            createErrorCard(
                "A profile with that username doesn't seem to exist..."
            );
        }
    }
}

function createUserCard(user) {
    const cardHTML = `
        <div class="card">
            <img class="avatar" src="${user.avatar_url}" alt="${user.login}">
            <div class="user-info">
                <h2>${user.login}</h2>
                <p>${user.bio}</p>


                <ul>
                    <li>${user.followers} <strong>Followers</strong></li>
                    <li>${user.following} <strong>Following</strong></li>
                    <li>${user.public_repos} <strong>Repos</strong></li>
                </ul>

                <div id="repos"></div>
            </div>
        </div>
    `;

    main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h2>${msg}</h2>
        </div>
    `;

    main.innerHTML = cardHTML;
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + "/repos?sort=created");
        addReposToCard(data);
    } catch (err) {
        createErrorCard("There was a probelm fetching repos...");
    }
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos.slice(0, 5).forEach((repo) => {
        const repoEl = document.createElement("a");
        repoEl.classList.add("repo");
        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = `${repo.name}`;
        reposEl.appendChild(repoEl);
    });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);
        search.value = "";
    } else {
    }
});
