const apiUrl = "https://jsonplaceholder.typicode.com/posts?_limit=6";

const resourcesContainer = document.getElementById("resourcesContainer");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");

// Fetch data using Axios GET request
async function fetchResources() {
  loadingMessage.classList.remove("hidden");
  errorMessage.classList.add("hidden");

  try {
    const response = await axios.get(apiUrl);

    const posts = response.data;

    displayResources(posts);

  } catch (error) {
    console.error("API Error:", error);

    errorMessage.classList.remove("hidden");
    errorMessage.textContent =
      "Unable to load resources. Please try again later.";

  } finally {
    loadingMessage.classList.add("hidden");
  }
}

// Display API data dynamically
function displayResources(posts) {
  resourcesContainer.innerHTML = "";

  posts.forEach(post => {
    const card = document.createElement("article");

    card.className =
      "rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition";

    const heading = document.createElement("h3");
    heading.className = "mb-3 text-lg font-bold text-gray-900";
    heading.textContent = post.title;

    const description = document.createElement("p");
    description.className = "text-sm leading-6 text-gray-600";
    description.textContent = post.body;

    const postNumber = document.createElement("p");
    postNumber.className = "mb-3 text-xs font-semibold text-purple-700";
    postNumber.textContent = `RESOURCE #${post.id}`;

    card.appendChild(postNumber);
    card.appendChild(heading);
    card.appendChild(description);

    resourcesContainer.appendChild(card);
  });
}

// Load API data when the page opens
fetchResources();
