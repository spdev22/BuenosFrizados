# API Services

This folder contains all the API calls to the BuenosFrizados backend.

## Structure

- `client.ts` - Axios instance with base URL from environment variables
- `products.ts` - Product related API calls (get, create, update)
- `orders.ts` - Order related API calls (get, create, confirm, deliver)

## Environment Variables

VITE_API_URL=http://localhost:{port}