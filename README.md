# Cube Controller (Three.js)
This project is a **3D interactive cube app** built with [Three.js](https://threejs.org/).
It renders a textured cube (Grass block) and allows you to:
* Rotate the scene with the mouse (OrbitControls).
* Move the cube in 3D space (`up`, `down`, `left`, `right`).
* Reset the cube’s position & rotation speed.
* Adjust cube rotation speed with a slider.
* Save & restore cube state via a backend API.

## Features
*  **Interactive Controls**: Move and rotate the cube in real time.
*  **Orbit Controls**: Click and drag to orbit around the cube.
*  **Textured Cube**: Each face textured individually.
*  **Backend Integration**: Save/reset cube state using REST API (`/api/cube/cube_1`).
*  **Speed Control**: Adjust cube rotation speed dynamically with an HTML slider.

---
##  Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Subithsjohn/The-Cube.git
cd The-cube
```
### 2. Install dependencies

Make sure you have **npm** installed.
```bash
npm install three
npm install -g http-server
```
### 3. To Start The Server
```bash
cd backend
node server.js
```
Open the ```index.html``` file using a Live Server

##  Controls
* **Mouse** → Rotate around the cube (OrbitControls).
* **Slider** → Adjust rotation speed.
* **Buttons**:
  *  `Up` → Move cube upward.
  *  `Down` → Move cube downward.
  *  `Left` → Move cube left.
  * `Right` → Move cube right.
  *  `Reset` → Reset cube position & speed.
  *  `Save` → Save cube state to backend.
---

##  Backend API (Optional)

The project expects a backend running at `http://localhost:5000`.
Endpoints used:
* `POST /api/cube/cube_1/save` → Save cube position & rotation speed.
* `POST /api/cube/cube_1/reset` → Reset cube to last saved state.

---
##  Preview

![unknown_2025 08 25-22 28](https://github.com/user-attachments/assets/b254d242-cbc7-4988-bc74-7bbbfb110c25)

---

##  License

This project is open source. Feel free to modify and use it in your own projects.
