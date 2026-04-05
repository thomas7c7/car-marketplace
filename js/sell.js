// Sell page should only work when a user is logged in.

const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!currentUser) {
  window.location.href = "login.html";
}

const form = document.getElementById("sell-form");
const vinBtn = document.getElementById("vin-btn");
const vinMessage = document.getElementById("vin-message");
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

// If there is an editCar value in storage, I know the form is in edit mode.
const editCar = JSON.parse(localStorage.getItem("editCar"));

if (vinMessage) {
  vinMessage.textContent = "";
}

// Pre-fill the form if the user is editing a listing they already created.
if (editCar && submitBtn) {
  document.getElementById("vin").value = editCar.vin || "";
  document.getElementById("make").value = editCar.make || "";
  document.getElementById("model").value = editCar.model || "";
  document.getElementById("year").value = editCar.year || "";
  document.getElementById("price").value = editCar.price || "";
  document.getElementById("mileage").value = editCar.mileage || "";
  document.getElementById("color").value = editCar.color || "";
  document.getElementById("location").value = editCar.location || "";
  document.getElementById("image").value = editCar.image || "";
  document.getElementById("description").value = editCar.description || "";

  submitBtn.textContent = "Update Listing";
}

// VIN lookup only fills in the basic vehicle info. The rest still comes from the user.
if (vinBtn) {
  vinBtn.addEventListener("click", () => {
    const vin = document.getElementById("vin").value.trim();

    if (vinMessage) {
      vinMessage.textContent = "";
    }

    if (vin.length !== 17) {
      vinMessage.textContent = "VIN must be exactly 17 characters.";
      vinMessage.style.color = "red";
      return;
    }

    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`)
      .then((response) => response.json())
      .then((data) => {
        const results = data.Results;

        const make = results.find((item) => item.Variable === "Make")?.Value || "";
        const model = results.find((item) => item.Variable === "Model")?.Value || "";
        const year = results.find((item) => item.Variable === "Model Year")?.Value || "";

        if (!make && !model && !year) {
          vinMessage.textContent = "Could not find vehicle details for this VIN.";
          vinMessage.style.color = "red";
          return;
        }

        document.getElementById("make").value = make;
        document.getElementById("model").value = model;
        document.getElementById("year").value = year;

        vinMessage.textContent = "VIN loaded! Please fill remaining fields.";
        vinMessage.style.color = "green";
      })
      .catch((error) => {
        console.error("VIN lookup failed:", error);
        vinMessage.textContent = "VIN lookup failed. Please try again.";
        vinMessage.style.color = "red";
      });
  });
}

// Save the form as either a new listing or an updated listing.
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const carData = {
      id: editCar ? editCar.id : Date.now(),
      vin: document.getElementById("vin").value.trim(),
      make: document.getElementById("make").value.trim(),
      model: document.getElementById("model").value.trim(),
      year: document.getElementById("year").value.trim(),
      price: document.getElementById("price").value.trim(),
      mileage: document.getElementById("mileage").value.trim(),
      color: document.getElementById("color").value.trim(),
      location: document.getElementById("location").value.trim(),
      image: document.getElementById("image").value.trim(),
      description: document.getElementById("description").value.trim(),

      // This keeps track of who owns the listing.
      ownerId: editCar ? editCar.ownerId : currentUser.id,
      ownerName: editCar ? editCar.ownerName : currentUser.name,
      ownerEmail: editCar ? editCar.ownerEmail : currentUser.email
    };

    let storedCars = JSON.parse(localStorage.getItem("cars")) || [];

    if (editCar) {
      storedCars = storedCars.map((car) =>
        car.id === editCar.id ? carData : car
      );
      localStorage.removeItem("editCar");
    } else {
      storedCars.push(carData);
    }

    localStorage.setItem("cars", JSON.stringify(storedCars));
    window.location.href = "cars.html";
  });
}