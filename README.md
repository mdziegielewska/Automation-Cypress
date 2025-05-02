# Cypress Automation Tests for Magento Sample Store

**Project Overview**

This repository contains Cypress automation tests written in TypeScript to automate functionalities on the Magento Sample Store (https://magento.softwaretestingboard.com/). 

**Getting Started**

1. Clone the repository:
   ```git clone https://github.com/mdziegielewska/Automation-Cypress.git```

2. Install dependencies
    ```npm install ci```

3. Run tests
    ```npx cypress run```

**Technologies Used**

- Cypress
- TypeScript

**Test Coverages**

- Main Page
    - [x] Menu
    - [x] Search
    - [x] Widgets
    - [x] Hot sellers
    - [x] Footer
- Authorization
    - [x] Registration
    - [x] Login
        - [x] Forgotten password
- Categories
    - [x] Listings
    - [x] Filters
    - [x] Products Comparision
- PDP (Product Detail Page)
    - [x] Product info
    - [x] Reviews
    - [x] Related products
- Transaction path
    - [x] Mini Cart 
    - [x] Cart
    - [ ] Checkout
- My Account
    - [ ] Orders
    - [ ] Address book
    - [ ] Wishlist
    - [ ] Reviews

**Future work**

- Extend test coverage with new scenarios
- More optimalization
- Expand test suite to include testing on a range of screen sizes, especially mobile devices
