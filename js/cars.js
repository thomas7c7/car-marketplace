// Protect the browse page so only logged in users can access it.

const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!currentUser) {
  window.location.href = "login.html";
}

const carList = document.getElementById("car-list");
const filterManufacturer = document.getElementById("filter-manufacturer");
const filterMileage = document.getElementById("filter-mileage");
const sortCars = document.getElementById("sort-cars");
const vinSearchBtn = document.getElementById("vin-search-btn");
const vinResult = document.getElementById("vin-result");

// All saved car listings are stored here.
function getStoredCars() {
  return JSON.parse(localStorage.getItem("cars")) || [];
}

// Needed for sorting prices correctly.
function getNumericPrice(priceString) {
  return Number(String(priceString || "").replace(/[^0-9.-]+/g, ""));
}

// Needed for mileage filtering.
function getNumericMileage(mileageString) {
  return Number(String(mileageString || "").replace(/[^0-9.-]+/g, ""));
}

// Populate the manufacturer dropdown using the cars already stored.
function populateManufacturerFilter() {
  if (!filterManufacturer) return;

  const cars = getStoredCars();
  const manufacturers = [...new Set(cars.map((car) => car.make).filter(Boolean))];

  filterManufacturer.innerHTML = `<option value="all">All Manufacturers</option>`;

  manufacturers.sort().forEach((manufacturer) => {
    const option = document.createElement("option");
    option.value = manufacturer;
    option.textContent = manufacturer;
    filterManufacturer.appendChild(option);
  });
}

// Delete only removes the selected listing from storage.
function deleteCar(carId) {
  const storedCars = getStoredCars();
  const updatedCars = storedCars.filter((car) => car.id !== carId);
  localStorage.setItem("cars", JSON.stringify(updatedCars));

  populateManufacturerFilter();
  applyFiltersAndSort();
}

// I save the selected listing first, then reuse the sell form for editing.
function editCar(car) {
  localStorage.setItem("editCar", JSON.stringify(car));
  window.location.href = "sell.html";
}

// This renders all cards currently visible after filters/sorting.
function displayCars(carsArray) {
  if (!carList) return;

  carList.innerHTML = "";

  if (carsArray.length === 0) {
    carList.innerHTML = `<p class="not-found">No cars listed yet.</p>`;
    return;
  }

  carsArray.forEach((car) => {
    const isOwner = car.ownerId === currentUser.id;

    const carCard = document.createElement("div");
    carCard.classList.add("car-card");

    carCard.innerHTML = `
      <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}">
      <h3>${car.year} ${car.make} ${car.model}</h3>
      <p><strong>Manufacturer:</strong> ${car.make}</p>
      <p><strong>Price:</strong> ${car.price}</p>
      <p><strong>Mileage:</strong> ${car.mileage}</p>
      <p><strong>Location:</strong> ${car.location}</p>
      <p><strong>Listed by:</strong> ${car.ownerName || "Unknown User"}</p>

      ${
        isOwner
          ? `
            <div class="card-actions">
              <button class="edit-btn" type="button">Edit</button>
              <button class="delete-btn" type="button">Delete</button>
            </div>
          `
          : ""
      }
    `;

    // Clicking a card opens the detail page.
    carCard.addEventListener("click", () => {
      localStorage.setItem("selectedCar", JSON.stringify(car));
      window.location.href = "car.html";
    });

    // Only the owner should be able to edit or delete.
    if (isOwner) {
      const editBtn = carCard.querySelector(".edit-btn");
      const deleteBtn = carCard.querySelector(".delete-btn");

      editBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        editCar(car);
      });

      deleteBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        const confirmDelete = confirm(`Delete ${car.year} ${car.make} ${car.model}?`);
        if (confirmDelete) {
          deleteCar(car.id);
        }
      });
    }

    carList.appendChild(carCard);
  });
}

// This handles filtering and sorting from the browse page controls.
function applyFiltersAndSort() {
  let filteredCars = [...getStoredCars()];

  const selectedManufacturer = filterManufacturer ? filterManufacturer.value : "all";
  const selectedMileage = filterMileage ? filterMileage.value : "all";
  const selectedSort = sortCars ? sortCars.value : "default";

  if (selectedManufacturer !== "all") {
    filteredCars = filteredCars.filter((car) => car.make === selectedManufacturer);
  }

  if (selectedMileage === "under20000") {
    filteredCars = filteredCars.filter((car) => getNumericMileage(car.mileage) < 20000);
  } else if (selectedMileage === "20000to50000") {
    filteredCars = filteredCars.filter((car) => {
      const mileage = getNumericMileage(car.mileage);
      return mileage >= 20000 && mileage <= 50000;
    });
  } else if (selectedMileage === "over50000") {
    filteredCars = filteredCars.filter((car) => getNumericMileage(car.mileage) > 50000);
  }

  if (selectedSort === "price-low") {
    filteredCars.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
  } else if (selectedSort === "price-high") {
    filteredCars.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
  } else if (selectedSort === "year-new") {
    filteredCars.sort((a, b) => Number(b.year) - Number(a.year));
  } else if (selectedSort === "year-old") {
    filteredCars.sort((a, b) => Number(a.year) - Number(b.year));
  }

  displayCars(filteredCars);
}

populateManufacturerFilter();
applyFiltersAndSort();

filterManufacturer?.addEventListener("change", applyFiltersAndSort);
filterMileage?.addEventListener("change", applyFiltersAndSort);
sortCars?.addEventListener("change", applyFiltersAndSort);

// VIN lookup on browse page is just for quick decoding/testing.
if (vinSearchBtn && vinResult) {
  vinSearchBtn.addEventListener("click", () => {
    const vinInput = document.getElementById("vin-search");
    const vin = vinInput ? vinInput.value.trim() : "";

    if (vin.length !== 17) {
      alert("VIN must be exactly 17 characters.");
      return;
    }

    vinResult.innerHTML = "<p>Loading...</p>";

    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`)
      .then((response) => response.json())
      .then((data) => {
        const results = data.Results;

        const make = results.find((item) => item.Variable === "Make")?.Value;
        const model = results.find((item) => item.Variable === "Model")?.Value;
        const year = results.find((item) => item.Variable === "Model Year")?.Value;

        if (!make && !model && !year) {
          vinResult.innerHTML = "<p>No vehicle found for this VIN.</p>";
          return;
        }

        vinResult.innerHTML = `
          <div class="car-card">
            <h3>${year || "N/A"} ${make || ""} ${model || ""}</h3>
            <p><strong>Manufacturer:</strong> ${make || "N/A"}</p>
            <p><strong>Model:</strong> ${model || "N/A"}</p>
            <p><strong>Year:</strong> ${year || "N/A"}</p>
          </div>
        `;
      })
      .catch((error) => {
        console.error("VIN lookup failed:", error);
        vinResult.innerHTML = "<p>Error fetching VIN data.</p>";
      });
  });
}