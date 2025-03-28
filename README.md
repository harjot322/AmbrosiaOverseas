# Ambrosia Overseas - Luxury Imported Foods Website

This is the codebase for the Ambrosia Overseas website, a luxury showcase site for imported food products.

## File Structure and Content Guide

### Images and Media

All images should be placed in the `/public` directory. Here are the key image files you'll need to replace:

- `/public/logo.png` - Your company logo (recommended size: 200x200px)
- `/public/hero-bg.jpg` - Homepage hero background image (recommended size: 1920x1080px)
- `/public/placeholder.svg` - Default product image placeholder (will be replaced by actual product images)

For product images, you should upload them to:
- `/public/products/[product-id]/main.jpg` - Main product image
- `/public/products/[product-id]/1.jpg`, `/public/products/[product-id]/2.jpg`, etc. - Additional product images

### Text Content

Text content is embedded within the React components. Here are the main files containing text that you might want to modify:

- `app/page.tsx` - Homepage content
- `app/about/page.tsx` - About Us page content
- `app/contact/page.tsx` - Contact page content
- `components/footer.tsx` - Footer content with contact information

### Configuration

- `.env.local` - Environment variables (create this file locally)
  - `MONGODB_URI` - MongoDB connection string
  - `JWT_SECRET` - Secret for JWT authentication

## Admin Access

The admin dashboard is accessible at `/admin` with the following credentials:
- Username: admin
- Password: HarjotAyansh

## Adding Products

Products can be added through the admin dashboard at `/admin/products/new`. You'll need to:
1. Fill in the product details
2. Upload product images
3. Set categories, tags, and other attributes

## Customization

### Colors

The color scheme is defined in `app/globals.css` and `tailwind.config.ts`. The main colors are:
- Gold: #d4af37
- Black: #000000
- Off-white: #fafafa

### Categories and Filters

To modify the product categories and filters, edit:
- `app/products/page.tsx` - Product filters
- `components/footer.tsx` - Footer categories

## Map Integration

The website uses OpenStreetMap for displaying the store location. The map is configured in:
- `components/open-street-map.tsx` - The OpenStreetMap component
- `app/contact/page.tsx` - Where the map is displayed

To update the map location, modify the latitude and longitude values in the OpenStreetMap component.

## Deployment

This website is designed to be deployed on Vercel. Connect your GitHub repository to Vercel and set up the environment variables mentioned above.

