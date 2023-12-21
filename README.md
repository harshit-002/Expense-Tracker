# Expense Tracker

## Overview

The Expense Tracker is a personal finance management tool that helps users track their expenses and gain insights into their spending habits. This project is implemented as a Telegram bot using Node.js and MongoDB for data storage.

## Features

- **Expense Logging:** Users can easily log their daily expenses, categorize them, and track spending over time.
- **Real-time Updates:** The Telegram bot provides real-time updates on expenses and financial summaries.
- **User-Friendly Interface:** The bot offers an intuitive interface for expense management, making it accessible to users of all levels.

## Technologies Used

- **Node.js:** Backend development for handling bot functionality and interactions.
- **MongoDB:** Database for storing user expenses and related data.
- **Telegram API:** Integration for user communication and real-time updates.

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up MongoDB:**
   - Create a MongoDB database and obtain the connection URI.
   - Update the `config.js` file with your MongoDB URI.

4. **Run the Bot:**
   ```bash
   npm start
   ```

5. **Interact with the Bot:**
   - Start a conversation with the Telegram bot.
   - Use commands like `/logExpense`, `/viewExpenses`, and more.

