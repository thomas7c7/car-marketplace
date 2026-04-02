const form = document.getElementById("sell-form");
const vinBtn = document.getElementById("vin-btn");
const vinMessage = document.getElementById("vin-message");

if (vinMessage) {
  vinMessage.textContent = "";
}

if (vinBtn) {
  vinBtn.addEventListener("click", () => {
    const vin = document.getElementById("vin").value.trim();

    vinMessage.textContent = "";

    if (vin.length !== 17) {
      vinMessage.textContent = "VIN must be exactly 17 characters.";
      vinMessage.style.color = "red";
      return;
    }

    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`)
      .then(response => response.json())
      .then(data => {
        const results = data.Results;

        const make = results.find(item => item.Variable === "Make")?.Value || "";
        const model = results.find(item => item.Variable === "Model")?.Value || "";
        const year = results.find(item => item.Variable === "Model Year")?.Value || "";

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
      .catch(error => {
        console.error("VIN lookup failed:", error);
        vinMessage.textContent = "VIN lookup failed. Please try again.";
        vinMessage.style.color = "red";
      });
  });
}

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const newCar = {
      id: Date.now(),
      vin: document.getElementById("vin").value.trim(),
      make: document.getElementById("make").value.trim(),
      model: document.getElementById("model").value.trim(),
      year: document.getElementById("year").value.trim(),
      price: document.getElementById("price").value.trim(),
      mileage: document.getElementById("mileage").value.trim(),
      color: document.getElementById("color").value.trim(),
      location: document.getElementById("location").value.trim(),
      image: document.getElementById("image").value.trim(),
      description: document.getElementById("description").value.trim()
    };

    const existingCars = JSON.parse(localStorage.getItem("cars")) || [];
    existingCars.push(newCar);
    localStorage.setItem("cars", JSON.stringify(existingCars));

    window.location.href = "cars.html";
  });
}