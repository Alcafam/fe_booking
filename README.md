# Event Booking: [https://fe-booking-eight.vercel.app/](https://fe-booking-eight.vercel.app/)

This project is a React-based Event Booking application where users can browse events and make bookings. It uses `react-router` for client-side routing and other modern React features.
**Deployed @ vercel**

## Setup Instructions

Follow these steps to set up the project on your local machine:

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or later) – to run the development server and install dependencies.
- **npm** or **yarn** – to manage JavaScript dependencies.

### Installation Steps

**Note**: Don't mind the pushed .env because it only had one line though I know that .env should not be pushed
1. **Clone the repository**:
   Open your terminal and run the following command to clone the repository:
   ```bash
   git clone https://github.com/Alcafam/fe_booking.git
   cd fe_booking
   ```

2. **Install dependencies**:
   If you're using **npm**:
   ```bash
   npm install
   ```

   Or if you're using **yarn**:
   ```bash
   yarn install
   ```

3. **Run the development server**:
   After installing the dependencies, you can start the development server. Run the following command to launch the app:

   If you're using **npm**:
   ```bash
   npm start
   ```

   Or if you're using **yarn**:
   ```bash
   yarn start
   ```
   
4. **Open the application in your browser**:

   After starting the server, you can view the application by navigating to:
   [http://localhost:3000](http://localhost:3000) or whatever link will the app gives you
---

## Brief Explanation of Approach for React

1. **Make It Work First, Then Refactor**:  
   The primary goal during the development was to make the core features functional as quickly as possible. This included implementing event booking, basic authentication, and necessary database interactions. Once the core features were confirmed to be working, refactoring and optimization were done to ensure maintainability and improve performance.

2. I did not do much for best practices...haha. I have not made some reusable components and there were a lot of redundant codes.

---

## Notes on Incomplete or Additional Features

1. Email Confirmation After Booking  
2. Event Search/Filter by Category or Date  
3. Authentication - HTTPOnly Cookies for Improved Security  

---


## Credentials that you can use
**Admin**
email : alice.johnson@example.com
password: password

email : alice.johnson@example.com
password: password

**Users**
email : bob.smith@example.com
password: password

email : john.doe@example.com
password: password

email : sarah.miller@example.com
password: password

email : james.williams@example.com
password: password
