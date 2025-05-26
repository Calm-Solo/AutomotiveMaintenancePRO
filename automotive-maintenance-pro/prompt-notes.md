# Automotive Maintenance Pro – Project Progress Reference

## Overview

This project is a modern, interactive automotive maintenance reminder app built with **Next.js**, **React**, **Tailwind CSS**, **react-spring**, and **framer-motion**. The goal is to help users track their vehicle’s maintenance schedule, visualize upcoming tasks, and receive smart reminders.

---

## Features Implemented

### 1. Modern UI & Animations
- **Gradient background** for a professional look.
- **Animated logo** in the navbar using `react-spring`.
- **Smooth section transitions** and button effects with `framer-motion`.

### 2. Navigation Bar
- Responsive navbar with the app logo as a button.
- App name ("AutoPro") and a simple dashboard label.

### 3. Hero Section
- Large, animated title and subtitle introducing the app’s purpose.

### 4. Vehicle Information Form
- Users can enter their vehicle’s **make**, **model**, **year**, and **current mileage**.
- Form is styled for clarity and accessibility.
- On submit, the app logs the vehicle info and calculates projected maintenance tasks.

### 5. Projected Maintenance Timeline
- After submitting vehicle info, users see a **timeline** of upcoming maintenance tasks.
- Each task displays:
  - Task name (e.g., Oil Change)
  - Maintenance tip
  - Projected due mileage (calculated based on user input and task interval)
- **Interactive mileage slider** allows users to project future mileage and see how it affects upcoming maintenance.

### 6. Maintenance Progress Tracker (NEW)
- **Visual progress bars** for each maintenance milestone, replacing the calendar.
- Progress bars are **color-coded**:
  - Green: On Track
  - Blue: Upcoming
  - Yellow: Due Soon
  - Red: Urgent (with pulse animation)
- Each bar shows:
  - Task name
  - Miles left until due
  - Progress percentage
  - Urgency status (On Track, Upcoming, Due Soon, Urgent)
  - Maintenance tip

### 7. Upcoming Tasks List
- List of upcoming maintenance tasks with:
  - Task name
  - Due mileage
  - Maintenance tip
  - Checkbox for completion (UI only for now)

---

## State & Logic

- **Vehicle Info State:** Managed with React’s `useState`.
- **Projected Tasks State:** Calculated and stored after form submission and slider changes.
- **Animations:** Managed with `react-spring` and `framer-motion`.
- **Maintenance Tasks:** Defined in a single array (`defaultMaintenanceTasks`) with intervals and due dates.
- **Progress Calculation:** Progress bars update dynamically based on current and projected mileage.

---

## Next Steps

- **Backend Integration:** Save and retrieve user/vehicle data.
- **AI Recommendations:** Use vehicle info to generate smart, personalized maintenance advice.
- **User Authentication:** Allow users to save and return to their data.
- **Enhance Progress Tracker:** Add more visual cues, history, or allow marking tasks as completed.
- **Add More Pages:** For maintenance history, settings, or service provider recommendations.

---

## File Reference

- **Main Page:**  
  `src/app/page.tsx`  
  Contains all UI, state, and logic described above.

---

## How to Deploy to Azure Static Web Apps

### 1. **Project Structure**
- The Next.js app is in the `automotive-maintenance-pro` subfolder.
- All build and deployment steps are run from this directory.

### 2. **Tailwind & Next.js Configuration**
- `tailwind.config.js` includes all relevant folders in the `content` array.
- `globals.css` contains only:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- `next.config.js` contains:
  ```js
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true
    }
  };
  module.exports = nextConfig;
  ```

### 3. **GitHub Actions Workflow**
- Only one Azure Static Web Apps workflow file is kept (matching the Azure resource name).
- Example workflow (`.github/workflows/azure-static-web-apps-ambitious-sky-03831211e.yml`):

  ```yaml
  name: Azure Static Web Apps CI/CD

  on:
    push:
      branches:
        - main
    pull_request:
      types: [opened, synchronize, reopened, closed]
      branches:
        - main

  jobs:
    build_and_deploy_job:
      runs-on: ubuntu-latest
      name: Build and Deploy Job
      steps:
        - uses: actions/checkout@v3

        - name: Set up Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '18.x'

        - name: Install Dependencies
          run: |
            cd automotive-maintenance-pro
            npm install

        - name: Build And Deploy
          id: builddeploy
          uses: Azure/static-web-apps-deploy@v1
          with:
            azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_SKY_03831211E }}
            repo_token: ${{ secrets.GITHUB_TOKEN }}
            action: "upload"
            app_location: "automotive-maintenance-pro"
            output_location: "out"
            app_build_command: "npm run build"
            skip_app_build: false
  ```

### 4. **Static Export**
- No need to run `next export` manually; `output: 'export'` in `next.config.js` makes `npm run build` output static files to `out/`.

### 5. **Azure Portal**
- After a successful GitHub Actions run, use the "View your site" link in the Azure portal to access the deployed app.

### 6. **Troubleshooting**
- If you see a 404 or blank page:
  - Ensure only one workflow file exists for Azure Static Web Apps.
  - Confirm `output: 'export'` is set in `next.config.js`.
  - Make sure `output_location: "out"` in the workflow matches the static output directory.
  - Check that all dependencies are installed and the build passes locally (`npm run build` in `automotive-maintenance-pro`).

---

## How to Run Locally

1. Install dependencies:  
   `npm install`
2. Start the dev server:  
   `npm run dev`
3. Visit [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

- **Next.js** (React framework)
- **Tailwind CSS** (utility-first styling)
- **react-spring** (physics-based animations)
- **framer-motion** (animation and transitions)
- **TypeScript** (optional, recommended for future)

---

This document serves as a reference for what’s been built so far and as a guide for future development and deployment.