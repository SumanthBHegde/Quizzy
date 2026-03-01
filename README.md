<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Quiz Formator

A modern, interactive quiz application built with React and Vite. Create and display technical quizzes with real-time feedback and a beautiful UI.

## 🚀 Live Demo

Visit the live app: [Quiz Formator on GitHub Pages](https://YOUR_USERNAME.github.io/Quiz-Formator/)

## ✨ Features

- 📝 Interactive multiple-choice quiz interface
- ✅ Instant answer checking with visual feedback
- 🎨 Modern, responsive design
- 🚀 Fast performance with Vite
- 📱 Mobile-friendly interface

## 🛠️ Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Quiz-Formator.git
   cd Quiz-Formator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🌐 Deploy to GitHub Pages

### First-Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Git repository (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create a GitHub repository** named `Quiz-Formator` (or your preferred name)

4. **Add remote and push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/Quiz-Formator.git
   git branch -M main
   git push -u origin main
   ```

5. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

### Subsequent Deployments

After making changes, simply run:
```bash
npm run deploy
```

This will:
- Build your project
- Push the built files to the `gh-pages` branch
- Automatically update your live site

### Configure GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Source", select the `gh-pages` branch
4. Click **Save**
5. Your site will be live at `https://YOUR_USERNAME.github.io/Quiz-Formator/`

## 📁 Project Structure

```
Quiz-Formator/
├── src/
│   ├── App.tsx          # Main React component
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Global styles
│   └── md_to_quiz.js    # Quiz conversion utilities
├── index.html           # HTML template
├── quiz.html            # Standalone quiz HTML
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

## 🔧 Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run lint` | Run TypeScript type checking |

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

Made with ❤️ using React and Vite
