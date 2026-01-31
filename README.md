# React Python Movies

Deployed at https://react-python-movies-cspk.onrender.com/

## How to run

### Backend (FastAPI)
1. Go to `api` directory
2. Install dependencies: `pip install -r requirements.txt`
3. Start the application: `uvicorn main:app --reload`

### Frontend (React)
1. Go to `ui` directory
2. Install dependencies: `npm install`
3. Start the application: `npm start`

## Deployment

This application is deployed on Render.

### How to deploy changes
To deploy changes to Render, push your code to the main branch of the repository connected to Render:
```bash
git push origin main
```
Render will automatically detect the changes and rebuild the application based on the `Dockerfile`.