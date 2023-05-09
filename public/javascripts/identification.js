// const fetchSPARQLEndpoint = require("fetch-sparql-endpoint");
function clearSearch() {
  const searchText = document.getElementById("search-text");
  const searchResults = document.getElementById("search-results");
  searchText.value = "";
  searchResults.innerHTML = "";
}

async function searchBird() {
  const searchText = document.getElementById("search-text");
  const sanitisedSearch = searchText.value.replace(/[^a-zA-Z0-9]/g, "");

  if (!sanitisedSearch) {
    // leave blank
  } else {
    // Show loading spinner
    const spinner = document.getElementById("spinner");
    spinner.classList.remove("d-none");

    // Query DBPedia to get bird information
    const query = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    SELECT ?bird ?label ?description ?image
    WHERE {
      ?bird a dbo:Bird;
      rdfs:label ?label;
      dbo:abstract ?description;
      dbo:thumbnail ?image.
      FILTER(LANG(?label) = 'en' && LANG(?description) = 'en' && regex(?label, '${sanitisedSearch}',"i"))
    }
    LIMIT 5`;

    // const url = `https://dbpedia.org/sparql?query=${encodeURIComponent(
    //   query
    // )}&format=json`;
    const endpointUrl = "https://dbpedia.org/sparql";
    const encodedQuery = encodeURIComponent(query);
    const url = `${endpointUrl}?query=${encodedQuery}&format=json`;
    const response = await fetch(url);

    // TODO: fetch-sparql-endpoint
    // const endpoint = "https://dbpedia.org/sparql";
    // const query = `
    //   PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    //   PREFIX dbo: <http://dbpedia.org/ontology/>
    //   SELECT ?bird ?label ?description
    //   WHERE {
    //     ?bird a dbo:Bird;
    //     rdfs:label ?label;
    //     dbo:abstract ?description;
    //     FILTER(LANG(?label) = 'en' && LANG(?description) = 'en' && regex(?label, '${sanitisedSearch}',"i"))
    //   }
    //   LIMIT 5
    // `;
    // const options = {
    //   headers: {
    //     Accept: "application/sparql-results+json",
    //   },
    // };
    // const response = await fetchSPARQLEndpoint(endpoint, query, options);

    if (response.ok) {
      const data = await response.json();
      displayResults(data);
      spinner.classList.add("d-none");
      // console.log(data.results.bindings[0].image.value);
    } else {
      console.error("Failed to fetch search results:", response.status);
    }
  }
}

function displayResults(data) {
  // Results area
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "";
  const bindings = data.results.bindings;

  // Make the resultsContainer visible
  resultsContainer.style.display = "block";

  if (bindings.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
  } else {
    // Create result area title
    const list = document.createElement("ul");
    const label = document.createElement("div");
    label.innerHTML = "<h5>Please click the image to choose the bird</h5>";
    list.appendChild(label);

    // Obtain each bird's info
    for (const binding of bindings) {
      const birdName = binding.label.value.split("/").pop().replace(/_/g, " ");
      const description = binding.description.value;
      const url = binding.bird.value;
      const imgSrc = binding.image.value;

      // Create a new form group for each bird
      const formGroup = document.createElement("div");
      formGroup.classList.add("bird-results-container");
      formGroup.classList.add("mb-3");

      // Display the bird image
      const img = document.createElement("img");
      img.setAttribute("src", imgSrc);
      img.setAttribute("alt", birdName);
      img.setAttribute("class", "result-img");
      formGroup.appendChild(img);

      // Create label for bird name
      const birdLabel = document.createElement("label");
      birdLabel.classList.add("form-label");
      birdLabel.textContent = "Bird Name:";
      formGroup.appendChild(birdLabel);

      // Create input for bird name
      const nameInput = document.createElement("input");
      nameInput.setAttribute("type", "text");
      nameInput.setAttribute("class", "form-control");
      nameInput.setAttribute("value", birdName);
      nameInput.setAttribute("readonly", "true");
      formGroup.appendChild(nameInput);

      // Create label for description
      const desLabel = document.createElement("label");
      desLabel.classList.add("form-label");
      desLabel.textContent = "Description:";
      formGroup.appendChild(desLabel);

      // Create textarea for description
      const textarea = document.createElement("textarea");
      textarea.setAttribute("class", "form-control");
      textarea.setAttribute("readonly", "true");
      textarea.textContent = description;
      formGroup.appendChild(textarea);

      // Create label for URL
      const urlLabel = document.createElement("label");
      urlLabel.classList.add("form-label");
      urlLabel.textContent = "URL:";
      formGroup.appendChild(urlLabel);

      // Create input for URL
      const URLInput = document.createElement("input");
      URLInput.setAttribute("type", "text");
      URLInput.setAttribute("class", "form-control");
      URLInput.setAttribute("value", url);
      URLInput.setAttribute("readonly", "true");
      formGroup.appendChild(URLInput);

      // Add click event to image
      const birdNameInput = document.getElementById("modal-bird-name");
      const descriptionInput = document.getElementById("modal-description");
      const urlInput = document.getElementById("modal-url");

      img.addEventListener("click", () => {
        birdNameInput.value = birdName;
        descriptionInput.value = description;
        urlInput.value = url;
        birdNameInput.focus();
      });

      // Append each formGroup to resultsContainer
      list.appendChild(formGroup);
    }
    resultsContainer.appendChild(list);
  }
}

function goToTop() {
  const searchText = document.getElementById("search-text");
  searchText.focus();
}

function updateIdentification(author) {
  const birdName = document.getElementById("birdName");
  const description = document.getElementById("description");
  const url = document.getElementById("url");

  const birdNameInput = document.getElementById("modal-bird-name");
  const descriptionInput = document.getElementById("modal-description");
  const urlInput = document.getElementById("modal-url");
  const modal = document.getElementById("modal");
  const bootstrapModal = new bootstrap.Modal(modal);

  const username = sessionStorage.getItem("username");
  if (username === author) {
    // Populate modal inputs with current identification data
    birdNameInput.value = birdName.textContent.trim();
    descriptionInput.value = description.textContent.trim();
    urlInput.value = url.textContent.trim();

    // Show modal dialog box
    bootstrapModal.show();
  } else {
    alert("Sorry, you don't have permission to edit the page.");
  }
}

// To avoid uncaught syntax error for JSON.stringify
function sanitiseText(text) {
  // return text.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
  //   return "&#" + i.charCodeAt(0) + ";";
  // });
  return text.replace(/['"]/g, "");
}

async function saveChanges(sightingId) {
  const birdName = document.getElementById("birdName");
  const description = document.getElementById("description");
  const url = document.getElementById("url");

  const birdNameInput = document.getElementById("modal-bird-name");
  const descriptionInput = document.getElementById("modal-description");
  const urlInput = document.getElementById("modal-url");

  const modal = document.getElementById("modal");
  const bootstrapModal = new bootstrap.Modal(modal);

  // const data = {
  //   birdName: birdNameInput.value.replace(/'/g, ""),
  //   description: descriptionInput.value.replace(/'/g, ""),
  //   url: urlInput.value.replace(/'/g, ""),
  // };

  const data = {
    birdName: sanitiseText(birdNameInput.value),
    description: sanitiseText(descriptionInput.value),
    url: sanitiseText(urlInput.value),
  };
  const response = await fetch(`/details?id=${sightingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    window.location.reload();
    birdName.textContent = data.birdName;
    description.textContent = data.description;
    url.textContent = data.url;
    // Hide modal dialog box
    bootstrapModal.hide();
  } else {
    console.error("Failed to update identification data");
  }
}


//
// /**
//  * When the client gets off-line, it shows an off line warning to the user
//  * so that it is clear that the data is stale
//  */
// window.addEventListener('offline', function(e) {
//   // Queue up events for server.
//   console.log("You are offline");
//   showOfflineWarning();
// }, false);
//
// /**
//  * When the client gets online, it hides the off line warning
//  */
// window.addEventListener('online', function(e) {
//   // Resync data with server.
//   console.log("You are online");
//   hideOfflineWarning();
// }, false);
//
//
// function showOfflineWarning() {
//   if (document.getElementById('offline_div') != null)
//     document.getElementById('offline_div').style.display = 'block';
// }
//
// function hideOfflineWarning() {
//   if (document.getElementById('offline_div') != null)
//     document.getElementById('offline_div').style.display = 'none';
// }