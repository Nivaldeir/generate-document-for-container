# Project Structure

This project follows a modular architecture based on local scope and shared scope separation.

## Main Structure

```txt
src/
├── app/
│   ├── (page)/
│   │   ├── _components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── page.tsx
│   │
│   └── shared/
│       ├── components/
│       ├── config/
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       └── styles/


Organization Rules
app/(page)

Each page must be isolated and contain only files related to its own domain.

Everything exclusive to the page should remain inside it.

Examples:

page-specific components
page-specific hooks
local utilities
local types
local validations
_components

Stores components used only by the current page.

Rules:

if a component is not globally reusable, it should stay here
avoid moving local components to shared unnecessarily

Example:

app/dashboard/_components/stats-card.tsx
hooks

Contains hooks exclusive to the page.

Rules:

local hooks stay inside the page
global reusable hooks go to shared/hooks

Example:

app/dashboard/hooks/use-dashboard-data.ts
utils

Utility functions, constants, schemas, and local page types.

Examples:

formatters
mappers
zod schemas
types
enums

Example:

app/dashboard/utils/chart-config.ts
shared/

Everything inside shared must be globally reusable.

Nothing inside shared should depend on a specific page.

shared/components

Reusable global UI components.

Examples:

Button
Modal
Input
Table
Layouts
shared/config

Global application configurations.

Examples:

navigation
env
feature flags
constants
shared/contexts

Global React contexts.

Examples:

AuthContext
ThemeContext
SidebarContext
shared/hooks

Globally reusable hooks.

Examples:

useDebounce
useMediaQuery
useAuth
shared/lib

Internal libraries and integrations.

Examples:

api client
axios instance
date helpers
cache utilities
shared/styles

Global application styles.

Examples:

globals.css
tailwind.css
design tokens
themes