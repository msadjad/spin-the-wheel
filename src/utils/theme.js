// Check if the user prefers dark mode
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Function to update theme
function updateTheme() {
  // If user prefers dark and hasn't explicitly chosen light mode
  if (prefersDark.matches && !document.documentElement.classList.contains('light')) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Initial setup
updateTheme();

// Listen for system theme changes
prefersDark.addListener(updateTheme); 