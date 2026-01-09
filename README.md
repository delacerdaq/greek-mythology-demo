<div align="center">

# Greek Mythology Demo

A modern, interactive web application showcasing Greek mythology characters with beautiful card-based design, filtering, search functionality, and favorites management.

</div>

## 🎨 Design

View the original design on Figma: <a href="https://www.figma.com/design/kmhEMGxPMlfdzNSDQYbrza/Greek-Mythology-Cards?node-id=0-1&p=f&t=VWoS08IvKOY7ZF4M-0" target="_blank" rel="noopener">Greek Mythology Cards Design</a>

## 🌐 Live Demo

Experience the application live: <a href="https://delacerdaq.github.io/greek-mythology-demo/" target="_blank" rel="noopener">Greek Mythology Demo</a>

## ✨ Features

- **Character Cards**: Beautiful, color-coded cards displaying Greek mythology characters
- **Search & Filter**: Search by name, filter by category and era
- **Favorites System**: Save your favorite characters with persistent storage
- **Dark/Light Theme**: Toggle between dark and light themes
- **Character Details**: Detailed popup modals with full character information
- **Pagination**: Load more characters with infinite scroll-like functionality
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technologies Used

This project is built with:

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with custom properties and animations
- **JavaScript (ES6+)**: 
  - Vanilla JavaScript with ES6 modules
  - LocalStorage API for favorites persistence
  - Fetch API for data loading
  - DOM manipulation and event handling
  - Dynamic card rendering and filtering

## 📁 Project Structure

```
greek-mythology-demo/
├── index.html          # Main page
├── favorites.html      # Favorites page
├── about.html          # About page
├── 404.html            # 404 error page
├── css/
│   ├── style.css      # Main stylesheet
│   ├── about.css      # About page styles
│   └── 404.css        # 404 page styles
├── js/
│   ├── core.js        # Core functionality and utilities
│   ├── script.js       # Main page logic
│   ├── favorites.js    # Favorites page logic
│   └── about.js        # About page logic
└── data/
    ├── greek_characters.json  # Character data
    └── images/                # Character images
```

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/delacerdaq/greek-mythology-demo.git
```

2. Navigate to the project directory:
```bash
cd greek-mythology-demo
```

3. Open `index.html` in your web browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server
```

4. Visit `http://localhost:8000` in your browser

## 📝 Usage

- **Browse Characters**: Scroll through the character cards on the main page
- **Search**: Use the search bar to find specific characters by name
- **Filter**: Select categories or eras from the dropdown menus
- **View Details**: Click "SEE MORE" on any card to view detailed information
- **Add Favorites**: Click the heart icon on any character card
- **View Favorites**: Navigate to the Favorites page to see all saved characters
- **Toggle Theme**: Click the theme toggle icon to switch between dark and light modes

## 🎯 Key JavaScript Features

- **ES6 Modules**: Modular code structure for better organization
- **LocalStorage**: Persistent favorites storage
- **Dynamic Rendering**: Efficient card creation and rendering
- **Event Delegation**: Optimized event handling
- **URL Parameters**: Shareable character links via URL parameters
- **Theme Management**: Persistent theme preference storage

## 📄 License

See the [LICENSE](LICENSE) file for details.

## 👤 Author

Created by <a href="https://github.com/delacerdaq" target="_blank" rel="noopener">delacerdaq</a> ♥

---

Enjoy exploring the world of Greek mythology! 🏛️⚡

