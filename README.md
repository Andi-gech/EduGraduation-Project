# EduGraduation Project

An online university management system developed as a graduation project. The repository contains separate application directories for the administration interface, API, student-facing interface, and related modules.

## Repository structure

- `EduAdmin/`: administration frontend.
- `EduApi/`: backend API.
- `Edu-hub/`: student or university portal application.
- `Edu-Digital/`: supporting application module.
- `EduCafe/`: cafe-related application module.
- `docker-compose.yml`: currently defines the admin frontend container.

## Technology

The admin application uses React and Vite. The API package includes Express and MongoDB-related dependencies. Other application directories have their own dependencies and setup requirements.

## Running the admin frontend

```bash
cd EduAdmin
npm install
npm run dev
```

The current Compose configuration starts only the admin frontend. It does not start the complete system or its API dependencies.

## Running the API

```bash
cd EduApi
npm install
```

Configure the API's required environment variables before starting it. Do not commit credentials, API keys, or database connection strings.

## Project status

This is an academic project. The repository contains multiple applications, and the full end-to-end setup has not yet been consolidated into one verified development workflow. Review each module's configuration before deployment.
