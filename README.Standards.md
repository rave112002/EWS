🧩 Project Standards and Guidelines

This document defines the project structure, naming conventions, and configuration standards used across this React + Tailwind + Ant Design project.

🏗️ Folder Structure
src/
├─ assets/ # Images, fonts, static files
├─ components/ # Shared or reusable UI components
├─ features/ # Feature-specific components
├─ helpers/ # Utility functions, hooks, and context files
├─ pages/ # Page-level components
├─ routes/ # React Router configurations
├─ styles/ # (Optional) Additional global or component styles
├─ App.jsx # Main application entry component
├─ main.jsx # ReactDOM root and ConfigProvider setup
├─ index.css # Tailwind, theme, and global style definitions

🧩 Naming Conventions
kebab-case - for all folders.
PascalCase - for classes, types and components.
camelCase - for functions, zod schemas and etc.
snake_case - for database tables and columns.

🎨 Styling and Theming

All global colors must be declared in @theme.
Use Tailwind token names directly (bg-green, bg-green-hover, etc.).
Avoid inline styles for colors — use variables for theme consistency.
