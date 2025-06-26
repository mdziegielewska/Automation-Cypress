# Cypress Automation Tests for Magento Sample Store

## Project Overview

This repository contains Cypress automation tests written in TypeScript to automate functionalities on the Magento Sample Store (https://magento.softwaretestingboard.com/). 

## Getting Started

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
* [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mdziegielewska/Automation-Cypress.git
    cd Automation-Cypress
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *Note: `npm install ci` is great for CI/CD environments as it uses `package-lock.json`, but `npm install` is generally sufficient for initial local setup and will create/update the lock file if needed.*


### Running Tests

You have a few options for running the tests:

1.  **Run all tests in headless mode (recommended for CI/CD):**
    ```bash
    npx cypress run
    ```
    This command executes all tests in a headless browser and generates a report.

2.  **Open the Cypress Test Runner (interactive mode):**
    ```bash
    npx cypress open
    ```
    This command opens the Cypress Test Runner GUI, allowing you to select and run specific tests, debug them, and see the application in real-time as tests execute.


## Technologies Used

- **[Cypress](https://www.cypress.io/)** `^13.13.x` – Fast, easy, and reliable testing for anything that runs in a browser.
- **[TypeScript](https://www.typescriptlang.org/)** `^5.x.x` – A typed superset of JavaScript that compiles to plain JavaScript.

## Test Coverages

* **Main Page**
    * [x] Menu Navigation
    * [x] Search Functionality
    * [x] Widgets Display
    * [x] Hot Sellers Section
    * [x] Footer Links and Content
* **Authorization**
    * [x] User Registration
    * [x] User Login
        * [x] Forgotten Password Flow
* **Categories**
    * [x] Product Listings
    * [x] Product Filters
    * [x] Product Comparison
* **PDP (Product Detail Page)**
    * [x] Product Information Display
    * [x] Product Reviews
    * [x] Related Products Section
* **Transaction Path**
    * [x] Mini Cart Functionality
    * [x] Shopping Cart Page
    * [x] Checkout Process
        * [x] Checkout with Multiple Addresses
* **My Account** (Planned/In Progress)
    * [ ] Account Information Management
    * [ ] Order History
    * [ ] Address Book Management
    * [ ] Wishlist Management
    * [ ] Product Reviews Submission

## Future work

- Extend test coverage with new scenarios
- Refactor existing tests and explore strategies for faster execution times
- Expand test suite to include testing on a range of screen sizes, especially mobile devices
