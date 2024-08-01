const APIURL = "https://api.github.com/users/";
const form = document.getElementById("form");
const main = document.getElementById("main");
const search = document.getElementById("search");

const createUserCard = (user) => {
  const cardHTML = `
    <div class="card">
      <div>
        <img src="${user.avatar_url}" class="avatar" alt="${user.name}">
      </div>
      <div class="user-info">
        <h2>${user.name}</h2>
        <p>${user.bio || 'No bio provided'}</p> <ul>
          <li><strong>${user.followers}</strong> Followers</li>
          <li><strong>${user.following}</strong> Following</li>
          <li><strong>${user.public_repos}</strong> Repositories</li>
        </ul>
        <div class="repos" id="repos"></div>
      </div>
    </div>
  `;
  main.innerHTML = cardHTML;
};

const createErrorCard = (message) => {
  const cardHTML = `<div class="card"><h1>${message}</h1></div>`;
  main.innerHTML = cardHTML;
};

const addReposToCard = (repos) => {
  const reposElement = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoLink = document.createElement("a");
    repoLink.classList.add("repo");
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    repoLink.innerText = repo.name;
    reposElement.appendChild(repoLink);
  });
};

const getRepos = async (username) => {
  try {
    const response = await axios.get(APIURL + username + "/repos?sort=created");
    if (response.status === 200) {
      addReposToCard(response.data);
    } else {
      console.error(`Error fetching repos: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching repos:", error); 
  }
};

const getUser = async (username) => {
  try {
    const response = await axios.get(APIURL + username);
    if (response.status === 200) {
      createUserCard(response.data);
      getRepos(username);
    } else if (response.status === 404) {
      createErrorCard("No profile found");
    } else {
      console.error(`Unexpected response status: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching user:", error); 
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value.trim(); 
  if (user) {
    getUser(user);
    search.value = "";
  }
});
