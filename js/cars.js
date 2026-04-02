const carList = document.getElementById("car-list");
const filterMake = document.getElementById("filter-make");
const filterPrice = document.getElementById("filter-price");
const sortCars = document.getElementById("sort-cars");
const vinSearchBtn = document.getElementById("vin-search-btn");
const vinResult = document.getElementById("vin-result");

const defaultCars = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2022,
    price: "$24,000",
    mileage: "18,000 miles",
    color: "Black",
    location: "Louisville, KY",
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80",
    description: "Well-maintained Toyota Camry with clean interior and smooth ride."
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    year: 2021,
    price: "$22,500",
    mileage: "21,000 miles",
    color: "White",
    location: "Lexington, KY",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80",
    description: "Reliable Honda Civic in excellent condition with great fuel economy."
  },
  {
    id: 3,
    make: "Ford",
    model: "Mustang",
    year: 2020,
    price: "$31,000",
    mileage: "15,000 miles",
    color: "Red",
    location: "Nashville, TN",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80",
    description: "Sporty Ford Mustang with powerful performance and sleek design."
  },
  {
    id: 4,
    make: "BMW",
    model: "3 Series",
    year: 2023,
    price: "$41,000",
    mileage: "9,000 miles",
    color: "Gray",
    location: "Louisville, KY",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
    description: "Luxury BMW sedan with low mileage and premium interior."
  },
  {
    id: 5,
    make: "Nissan",
    model: "Altima",
    year: 2019,
    price: "$18,500",
    mileage: "42,000 miles",
    color: "Blue",
    location: "Bowling Green, KY",
    image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=900&q=80",
    description: "Clean Nissan Altima with great daily-driver reliability."
  },
  {
    id: 6,
    make: "Chevrolet",
    model: "Malibu",
    year: 2021,
    price: "$20,500",
    mileage: "27,000 miles",
    color: "Silver",
    location: "Frankfort, KY",
    image: "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?auto=format&fit=crop&w=900&q=80",
    description: "Spacious Chevrolet Malibu in very good condition."
  }
];

const savedCars = JSON.parse(localStorage.getItem("cars")) || [];
const cars = [...defaultCars, ...savedCars];

function getNumericPrice(priceString) {
  return Number(priceString.replace(/[^0-9.-]+/g, ""));
}

function displayCars(carsArray) {
  carList.innerHTML = "";

  if (carsArray.length === 0) {
    carList.innerHTML = `<p class="not-found">No cars match your filters.</p>`;
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
    `;

    carCard.addEventListener("click", () => {
      localStorage.setItem("selectedCar", JSON.stringify(car));
      window.location.href = "car.html";
    });

    carList.appendChild(carCard);
  });
}

function applyFiltersAndSort() {
  let filteredCars = [...cars];

  const selectedMake = filterMake.value;
  const selectedPrice = filterPrice.value;
  const selectedSort = sortCars.value;

  if (selectedMake !== "all") {
    filteredCars = filteredCars.filter(car => car.make === selectedMake);
  }

  if (selectedPrice === "under20000") {
    filteredCars = filteredCars.filter(car => getNumericPrice(car.price) < 20000);
  } else if (selectedPrice === "20000to30000") {
    filteredCars = filteredCars.filter(car => {
      const price = getNumericPrice(car.price);
      return price >= 20000 && price <= 30000;
    });
  } else if (selectedPrice === "over30000") {
    filteredCars = filteredCars.filter(car => getNumericPrice(car.price) > 30000);
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

displayCars(cars);

filterMake.addEventListener("change", applyFiltersAndSort);
filterPrice.addEventListener("change", applyFiltersAndSort);
sortCars.addEventListener("change", applyFiltersAndSort);

if (vinSearchBtn) {
  vinSearchBtn.addEventListener("click", () => {
    const vin = document.getElementById("vin-search").value.trim();

    if (vin.length !== 17) {
      alert("VIN must be exactly 17 characters.");
      return;
    }

    vinResult.innerHTML = "<p>Loading...</p>";

    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`)
      .then(response => response.json())
      .then(data => {
        const results = data.Results;

        const make = results.find(r => r.Variable === "Make")?.Value;
        const model = results.find(r => r.Variable === "Model")?.Value;
        const year = results.find(r => r.Variable === "Model Year")?.Value;

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

    <button id="add-vin-car" class="btn">Add to Listings</button>
  </div>
`;

const addBtn = document.getElementById("add-vin-car");

if (addBtn) {
  addBtn.addEventListener("click", () => {

    const newCar = {
      id: Date.now(),
      make: make || "Unknown",
      model: model || "Unknown",
      year: year || "Unknown",
      price: "$0",
      mileage: "Unknown",
      color: "Unknown",
      location: "Unknown",
      image: "https://via.placeholder.com/300",
      description: "Added via VIN lookup"
    };

    const existingCars = JSON.parse(localStorage.getItem("cars")) || [];
    existingCars.push(newCar);

    localStorage.setItem("cars", JSON.stringify(existingCars));

    alert("Car added to listings!");

    // Refresh the list
    applyFiltersAndSort();
  });
}
      })
      .catch(error => {
        console.error("VIN lookup failed:", error);
        vinResult.innerHTML = "<p>Error fetching VIN data.</p>";
      });
  });
}