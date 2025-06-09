# Paws & Preferences - Cat Swiper App

A minimalist, aesthetic, and responsive cat swiper web app built with Next.js, React, Framer Motion, and Tailwind CSS. Swipe through random cat images, like your favorites, and see a summary of your preferences!

## Features

- Swipe left or right on cat images (Tinder-style)
- Like cats and see a summary of your liked cats
- Preview upcoming cats in a row below the main card
- Responsive and mobile-friendly UI
- Animated transitions with Framer Motion
- Displays a deduplicated list of your preferred cat tags in the summary

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Configure external image domains:**

Add the following to your `next.config.js` if not already present:

```js
module.exports = {
  images: {
    domains: ['cataas.com'],
  },
};
```

3. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

- Swipe right to like a cat, left to skip.
- Use the thumbs up/down buttons for accessibility.
- After all cats are swiped, see a summary of your liked cats and your unique cat tag preferences.
- Click "Start Over" to reload and try again.

## Customization

- Edit `app/page.tsx` to change the number of cats, UI, or logic.
- Uses Tailwind CSS for styling and Framer Motion for animation.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cataas API](https://cataas.com/#/)