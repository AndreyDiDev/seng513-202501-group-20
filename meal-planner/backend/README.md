# backend/README.md

# Web Application Backend

This is the backend part of the web application built using Express.js and Node.js. 

## Project Structure

- **src/**: Contains the source code for the backend application.
  - **app.ts**: Entry point of the application, initializes the Express app and sets up middleware.
  - **controllers/**: Contains controllers that handle API requests.
    - **index.ts**: Exports the IndexController class.
  - **routes/**: Defines the routes for the application.
    - **index.ts**: Exports the setRoutes function to associate routes with controller methods.
  - **types/**: Contains TypeScript interfaces for the application.
    - **index.ts**: Exports interfaces extending Express types.

## Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Running the Application

To start the backend server, run:
```
npm start
```

## API Endpoints

- **GET /**: Returns a welcome message.
- Additional endpoints will be documented here as they are implemented.

## License

This project is licensed under the MIT License.