# 2D3D Lottery Frontend

A modern web application for 2D and 3D lottery betting system built with React, TypeScript, and Material-UI.

## Features

- User authentication
- Balance management
- 2D/3D lottery betting
- Transaction history
- Responsive design
- Myanmar language support

## Tech Stack

- React 18
- TypeScript
- Material-UI
- React Router
- Formik & Yup
- Axios

## Prerequisites

- Node.js >= 18.16.0
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/2d3d-lottery-frontend.git
cd 2d3d-lottery-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
REACT_APP_API_URL=https://twod3dbe.onrender.com
REACT_APP_API_TIMEOUT=30000
REACT_APP_VERSION=1.0.0
REACT_APP_ENV=production
```

4. Start development server:
```bash
npm start
```

## Docker Deployment

Build the Docker image:
```bash
docker build -t 2d3d-lottery-frontend .
```

Run the container:
```bash
docker run -p 80:80 2d3d-lottery-frontend
```

## License

MIT License 