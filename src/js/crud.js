const STORAGE_KEY = "novaServices";

let services = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editingId = null;

// Save records in Local Storage
function saveServices() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

// Read: Display records dynamically
function displayServices(list = services) {
  const container = document.getElementById("servicesList");
  const count = document.getElementById("recordCount");

  if (!container) return;

  count.textContent = `${list.length} records`;

  container.innerHTML = list.map(service => `
    <article class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 class="text-lg font-bold text-gray-900">
        ${escapeHTML(service.name)}
      </h3>
      <p class="mt-2 text-sm text-gray-600">
        Category: ${escapeHTML(service.category)}
      </p>
      <p class="mt-2 text-gray-700">
        ${escapeHTML(service.description)}
      </p>
      <div class="mt-4 flex gap-3">
        <button onclick="editService('${service.id}')"
          class="rounded-lg bg-purple-600 px-4 py-2 text-white">
          Edit
        </button>
        <button onclick="deleteService('${service.id}')"
          class="rounded-lg bg-red-600 px-4 py-2 text-white">
          Delete
        </button>
      </div>
    </article>
  `).join("");

  if (list.length === 0) {
    container.innerHTML =
      '<p class="text-gray-500">No records found.</p>';
  }
}

// Escape user-entered text before displaying it as HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// Create: Add a new service
function addService(event) {
  event.preventDefault();

  const name = document.getElementById("serviceName").value.trim();
  const category = document.getElementById("serviceCategory").value;
  const description = document.getElementById("serviceDescription").value.trim();

  if (!name || !category || !description) {
    alert("Please fill in all fields.");
    return;
  }

  // every(): validate that all fields contain valid text
  const validFields = [name, category, description]
    .every(field => field.length > 0);

  if (!validFields) {
    alert("Please enter valid information.");
    return;
  }

  // some(): check whether a service with this name exists
  const duplicateExists = services.some(service =>
    service.name.toLowerCase() === name.toLowerCase() &&
    service.id !== editingId
  );

  if (duplicateExists) {
    alert("A service with this name already exists.");
    return;
  }

  if (editingId !== null) {
    // Update: Find and update an existing record
    const existingService = services.find(
      service => service.id === editingId
    );

    if (existingService) {
      existingService.name = name;
      existingService.category = category;
      existingService.description = description;
    }

    editingId = null;
    document.getElementById("submitButton").textContent = "Add Service";
  } else {
    // Store each record as an object in the array
    const newService = {
      id: crypto.randomUUID(),
      name,
      category,
      description
    };

    services.push(newService);
  }

  saveServices();
  displayServices();
  document.getElementById("serviceForm").reset();
}

// Find: Load a record into the form for editing
function editService(id) {
  const service = services.find(item => item.id === id);

  if (!service) return;

  editingId = id;
  document.getElementById("serviceName").value = service.name;
  document.getElementById("serviceCategory").value = service.category;
  document.getElementById("serviceDescription").value = service.description;
  document.getElementById("submitButton").textContent = "Update Service";

  document.getElementById("serviceForm").scrollIntoView({
    behavior: "smooth"
  });
}

// Delete: Remove a record
function deleteService(id) {
  const confirmed = confirm("Are you sure you want to delete this service?");

  if (!confirmed) return;

  services = services.filter(service => service.id !== id);

  if (editingId === id) {
    editingId = null;
    document.getElementById("serviceForm").reset();
    document.getElementById("submitButton").textContent = "Add Service";
  }

  saveServices();
  searchServices();
}

// Search and filter records
function searchServices() {
  const query = document.getElementById("searchInput")
    .value.trim().toLowerCase();

  const selectedCategory = document.getElementById("filterCategory").value;

  const filteredServices = services.filter(service => {
    const matchesSearch =
      service.name.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.category.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "all" ||
      service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  displayServices(filteredServices);
}

// Initialize the application when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("serviceForm");

  if (!form) return;

  form.addEventListener("submit", addService);

  document.getElementById("searchInput")
    .addEventListener("input", searchServices);

  document.getElementById("filterCategory")
    .addEventListener("change", searchServices);

  displayServices();
});
