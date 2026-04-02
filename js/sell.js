const form = document.getElementById("sell-form");
const vinBtn = document.getElementById("vin-btn");
const vinMessage = document.getElementById("vin-message");

// Clear message initially
if (vinMessage) {
  vinMessage.textContent = "";
}

if (vinBtn) {
  vinBtn.addEventListener("click", () => {
    const vin = document.getElementById("vin").value.trim();

    // Clear previous message
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

        // Autofill
        document.getElementById("make").value = make;
        document.getElementById("model").value = model;
        document.getElementById("year").value = year;

        // ✅ Show success message (better UX than alert)
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