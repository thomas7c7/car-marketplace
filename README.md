**Marketplace Web Application**
This is a multi-page car marketplace web application built using HTML, CSS, and JavaScript.
This project allows users to register, log in, browse available car listings, create their own listings, and manage listings they own.
The application also integrates VIN lookup functionality using the NHTSA Vehicle API and uses localStorage to store data.

**Features**
1.API Integration
The application integrates the NHTSA VIN Decoder API. Users can enter a 17-character VIN, and the application fetches vehicle information such as manufacturer, model, and year to auto-fill parts of the listing form.
2.Analyze data stored in arrays/objects and display it
The project analyzes and displays data stored in arrays and objects. Car listings are saved as objects inside an array in localStorage, then filtered, sorted, and rendered dynamically on the browse page.
3.Validate user input
The project analyzes and displays data stored in arrays and objects. Car listings are saved as objects inside an array in localStorage, then filtered, sorted, and rendered dynamically on the browse page.
4. Persist important data to local storage
The application persists important user data to localStorage, including registered users, login sessions, car listings, and temporary state for editing or viewing selected cars. This allows the data to remain accessible even after the page is refreshed.

**How to Run the Project**
1. Clone the repository
git clone https://github.com/thomas7c7/car-marketplace.git
2. Open the project in **VS Code**
3. Open login.html
4. Run using **Live Server**
The application should open at:
http://127.0.0.1:5501/html/login.html

**AI Assistance Documentation**
This project was designed and implemented by me as part of my capstone project.
AI was used only as a development support tool for debugging JavaScript errors, improving code structure, troubleshooting API integration and refining localStorage persistence logic.
**Authentication Flow**
AI assistance was used to help debug and refine the client-side authentication flow, including user registration, login validation, route protection, and dynamic navigation updates based on login state. 
**VIN Lookup API Integration**
AI assistance was used to support debugging and implementation of the NHTSA VIN Decoder API integration, specifically for fetching and parsing manufacturer, model, and year information from VIN input.
**Listing Management (CRUD)**
AI assistance was used during the development of the create, read, update, and delete functionality for vehicle listings. This included debugging localStorage persistence, rendering dynamic listing cards, edit mode handling, and deletion logic.
**Responsive Design**
AI assistance was used for layout refinement and responsive design suggestions involving CSS Grid, Flexbox, and media queries to support both desktop and mobile screen sizes. 
**All final code integration, testing, debugging decisions, and project structure were completed by me.**

