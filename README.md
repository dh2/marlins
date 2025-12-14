# Marlins Game Day Tracker

## Project Description

This project is a simple dashboard application to display baseball game results for the Miami Marlins and their affiliates. It fetches live game data from the MLB stats API and presents it in a clear and concise way, providing a real-time overview of scheduled, in-progress, and completed games.

## Getting Started

To run this application:

```bash
yarn install
yarn run dev
```

### Accessing The Dashboard

The dashboard can be reached at http://localhost:3000/dashboard

## Technologies Used

- **React**: The core library for building the user interface.
- **TypeScript**: For static typing, improving code quality and maintainability.
- **Vite**: A fast build tool for modern web development.
- **Material-UI**: A popular React UI framework for building a visually appealing and consistent design.
- **TanStack Query (React Query)**: For managing server-state, caching, and data fetching.
- **TanStack Router**: For file-based routing.
- **Gemini CLI Agent**: The primary tool used for scaffolding the application, creating components, and implementing features. The prompts used to generate this application can be found in [prompts.md](prompts.md).
- **ChatGPT**: Used for simple image generation (e.g., the `no-games.png` asset).
- **Testing**: There's an obvious hole for testing here that would be solved using Vitest and React Testing Libary

## Lessons Learned

- **API Complexity**: The MLB Stats API is a powerful resource but can be complex to navigate, with different endpoints required for different data points (schedule, live game state, line scores). It is also not an easy API to find information about its implementation.

- **AI-Assisted Development**: Using a generative AI agent like the Gemini CLI wass great for accelerating development, especially for boilerplate code and initial component creation. It really allowed me to spend the lion's share of my time analyzing the data rather than typing code. It allowed me to act as a project manager and code reviewer rather than having to hack away at all the code myself. It was important to provide clear, specific, and iterative prompts. I found cleanup and smaller tweaks to be much easier to just do myself, especailly for interface changes.
  - There were definitely times where waiting on the prompt to finish (or timeout) was frustrating. But overall it definitely was a more efficient way to write a quick project like this.

- **TanStack Routing**: This was my first time using this routing system and I really like the file-based version of this technology. It was a lot less overhead to get this up and running than ReactRouter was the first time I used it. Especailly since the TanStack eco-system all works nicely together "out of the box"

- **Latest Versions**: I used the latest version of a lot of technologies and was pleasantly surprised that most of my normal patterns worked pretty well. I didn't do much with Material UI, but first time I've used it in a while. Still a favorite for getting up and running with great components quickly.
