# Bushido Karate System Flowchart Project

This project contains the system architecture and navigation flowchart for the **Bushido Karate Academy** web application, modeled from the requirements image.

## Files Generated

1. **[flowchart.mmd](file:///c:/Users/SANTHOSH/OneDrive/Desktop/flowchart/flowchart.mmd)**:
   * The raw source file containing the complete system flow written in **Mermaid syntax**.
   * It maps out both the **Frontend Navigation** (Home, About Us, Courses, Belt System, Achievements, Contact, and Schedule modules) and the **Backend Data Flow** (API endpoints, Database read/write, and Admin CMS panel).

2. **[index.html](file:///c:/Users/SANTHOSH/OneDrive/Desktop/flowchart/index.html)**:
   * A premium, browser-based **Interactive Flowchart Designer & Viewer**.
   * Renders the flowchart in real-time, supports zooming/panning, switches between Light/Dark themes, and allows live code editing with automatic syntax validation.
   * Enables one-click exports to **SVG** format.

---

## How to Run & Edit the Flowchart

### 1. Open in Browser
A local web server has been started to serve the interactive designer. You can access it at:
👉 **[http://localhost:8080](http://localhost:8080)**

### 2. Direct Preview
If you prefer, you can open the static file directly in any modern browser:
* Double-click [index.html](file:///c:/Users/SANTHOSH/OneDrive/Desktop/flowchart/index.html) or run it.

---

## Flowchart Overview
The flowchart visually structures:
* **User Pages**: Hero banners, programs catalog, and belt timelines.
* **Database Models**: Ranks, schedules, student information, and dojos.
* **REST APIs**: Paths like `/api/courses` and `/api/belt-system` fetching from database storage.
* **Admin CMS**: The administrative console used to manage academy settings, notifications, grades, and schedules.
