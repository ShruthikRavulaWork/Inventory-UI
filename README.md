# Inventory Management UI (React)

This repository contains the frontend source code for the Inventory & Supplier Management application, built with React. It provides a complete user interface for both 'Admin' and 'Supplier' roles to interact with the backend API, manage inventory, and view analytics.

## Features

* **Secure Authentication:** User registration and login forms with JWT handling. The token is stored securely and sent with every API request.
* **Role-Based UI & Routing:** The application dynamically renders different dashboards and functionalities based on the user's role (Admin vs. Supplier), protecting routes from unauthorized access.
* **Admin Dashboard:**
  * **Full CRUD:** A comprehensive table view for admins to Create, Read, Update, and Soft-Delete all inventory items.
  * **Data Management:** Features include server-side pagination and searching and filtering to handle large datasets efficiently.
  * **Image Uploads:** A dedicated form for creating and editing items, including PNG image uploads.
* **Supplier Dashboard:**
  * **Item Management:** A personalized view for suppliers to see only the items assigned to them.
  * **In-Place Editing:** A user-friendly interface allowing suppliers to quickly edit the price and quantity of their items directly in the table.
* **Analytics Dashboard (Admin):**
  * **Data Visualization:** Interactive charts built with Nivo that provide insights into the inventory.
  * **Key Metrics:** Includes a bar chart for items with the least stock and a pie chart for suppliers with the least combined stock.
* **Robust Error Handling:**
  * User-friendly notifications (snackbars) are displayed for successful operations or errors.
  * The UI correctly interprets specific error messages from the backend API, whether for validation, authorization, or server issues.

## Technology Stack

* **Core:** React 18 (with Hooks)
* **Routing:** React Router v6
* **UI Components:** Material-UI (MUI) v5
* **Data Tables:** Material Table
* **Charting:** Nivo
* **API Communication:** Axios
* **State Management:** React Context API

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

* [Node.js](https://nodejs.org/en/) (v16 or later is recommended)
* [npm](https://www.npmjs.com/) (comes with Node.js)

## Setup and Installation

Follow these steps to get the frontend application running locally.

### 1. Backend Must Be Running

This frontend application is designed to communicate with the .NET backend API. **Please ensure the `InventoryAPI` project is running first** at the correct address.

### 2. Clone the Repository

Clone this repository to your local machine:
```bash
git clone https://github.com/ShruthikRavulaWork/Inventory-UI.git
cd Inventory-UI
```

### 3. Install Dependencies

Run the following command to install all the required libraries from `package.json`. This single command installs React, Material-UI, Nivo, Axios, and all other necessary packages.
```bash
npm install
```


### 4. Run the Application

Start the React development server with this command:
```bash
npm start
```

This will automatically open the application in your default web browser at **`http://localhost:3000`**.
