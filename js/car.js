const carDetail = document.getElementById("car-detail");
const selectedCar = JSON.parse(localStorage.getItem("selectedCar"));

if (!carDetail) {
  console.error("car-detail element not found");
} else if (selectedCar) {
  carDetail.innerHTML = `
    <div class="car-detail-card">
      <img src="${selectedCar.image}" alt="${selectedCar.year} ${selectedCar.make} ${selectedCar.model}">
      <h2>${selectedCar.year} ${selectedCar.make} ${selectedCar.model}</h2>
      <p><strong>Manufacturer:</strong> ${selectedCar.make}</p>
      <p><strong>Price:</strong> ${selectedCar.price}</p>
      <p><strong>Mileage:</strong> ${selectedCar.mileage}</p>
      <p><strong>Color:</strong> ${selectedCar.color || "N/A"}</p>
      <p><strong>Location:</strong> ${selectedCar.location || "N/A"}</p>
      <p><strong>Description:</strong> ${selectedCar.description || "No description provided."}</p>
      <p><strong>VIN:</strong> ${selectedCar.vin || "N/A"}</p>
      <a href="cars.html" class="btn">Back to Browse Cars</a>
    </div>
  `;
} else {
  carDetail.innerHTML = `<p class="not-found">Car not found.</p>`;
}