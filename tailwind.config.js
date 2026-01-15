/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Isso impede o celular de mudar as cores sozinho
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        delta: {
          yellow: '#F8AB1B', // O dourado da sua logo
          blue: '#426FA6',   // O azul exato da sua barra lateral
          dark: '#4D4D4D',   // O cinza escuro dos seus textos
        },
      },
    },
  },
  plugins: [],
}
