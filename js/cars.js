const carList = document.getElementById("car-list");
const filterManufacturer = document.getElementById("filter-manufacturer");
const filterMileage = document.getElementById("filter-mileage");
const sortCars = document.getElementById("sort-cars");
const vinSearchBtn = document.getElementById("vin-search-btn");
const vinResult = document.getElementById("vin-result");

function getStoredCars() {
  return JSON.parse(localStorage.getItem("cars")) || [];
}

function getNumericPrice(priceString) {
  return Number(String(priceString).replace(/[^0-9.-]+/g, ""));
}

function getNumericMileage(mileageString) {
  return Number(String(mileageString).replace(/[^0-9.-]+/g, ""));
}

function deleteCar(carId) {
  const storedCars = getStoredCars();
  const updatedCars = storedCars.filter(car => car.id !== carId);

  localStorage.setItem("cars", JSON.stringify(updatedCars));
  applyFiltersAndSort();
}

function editCar(car) {
  localStorage.setItem("editCar", JSON.stringify(car));
  window.location.href = "sell.html";
}

function displayCars(carsArray) {
  carList.innerHTML = "";

  if (carsArray.length === 0) {
    carList.innerHTML = `<p class="not-found">No cars listed yet.</p>`;
    return;
  }

  carsArray.forEach(car => {
    const carCard = document.createElement("div");
    carCard.classList.add("car-card");

    carCard.innerHTML = `
      <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}">
      <h3>${car.year} ${car.make} ${car.model}</h3>
      <p><strong>Manufacturer:</strong> ${car.make}</p>
      <p><strong>Price:</strong> ${car.price}</p>
      <p><strong>Mileage:</strong> ${car.mileage}</p>
      <p><strong>Location:</strong> ${car.location}</p>

      <div class="card-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    carCard.addEventListener("click", () => {
      localStorage.setItem("selectedCar", JSON.stringify(car));
      window.location.href = "car.html";
    });

    const editBtn = carCard.querySelector(".edit-btn");
    const deleteBtn = carCard.querySelector(".delete-btn");

    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      editCar(car);
    });

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const confirmDelete = confirm(`Delete ${car.year} ${car.make} ${car.model}?`);

      if (confirmDelete) {
        deleteCar(car.id);
      }
    });

    carList.appendChild(carCard);
  });
}

function applyFiltersAndSort() {
  let filteredCars = [...getStoredCars()];

  const selectedManufacturer = filterManufacturer?.value || "all";
  const selectedMileage = filterMileage?.value || "all";
  const selectedSort = sortCars?.value || "default";

  if (selectedManufacturer !== "all") {
    filteredCars = filteredCars.filter(
      car => car.make === selectedManufacturer
    );
  }

  if (selectedMileage === "under20000") {
    filteredCars = filteredCars.filter(
      car => getNumericMileage(car.mileage) < 20000
    );
  } else if (selectedMileage === "20000to50000") {
    filteredCars = filteredCars.filter(car => {
      const mileage = getNumericMileage(car.mileage);
      return mileage >= 20000 && mileage <= 50000;
    });
  } else if (selectedMileage === "over50000") {
    filteredCars = filteredCars.filter(
      car => getNumericMileage(car.mileage) > 50000
    );
  }

  if (selectedSort === "price-low") {
    filteredCars.sort(
      (a, b) => getNumericPrice(a.price) - getNumericPrice(b.price)
    );
  } else if (selectedSort === "price-high") {
    filteredCars.sort(
      (a, b) => getNumericPrice(b.price) - getNumericPrice(a.price)
    );
  } else if (selectedSort === "year-new") {
    filteredCars.sort((a, b) => Number(b.year) - Number(a.year));
  } else if (selectedSort === "year-old") {
    filteredCars.sort((a, b) => Number(a.year) - Number(b.year));
  }

  displayCars(filteredCars);
}

applyFiltersAndSort();

filterManufacturer?.addEventListener("change", applyFiltersAndSort);
filterMileage?.addEventListener("change", applyFiltersAndSort);
sortCars?.addEventListener("change", applyFiltersAndSort);