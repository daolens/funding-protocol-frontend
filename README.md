# Grant Management Protocal Frontend

## Setup

1. Install dependencies with `yarn`
2. Create `.env.local` file with `cp .env.local.example .env.local`
3. Run local server `yarn dev`


## Deployment
1. Run `gcloud auth login` to log in to your account. (Ignore if already logged in)
2. Build container and submit:
   ```
   gcloud builds submit --tag gcr.io/ardent-quarter-361905/gmp-frontend --project ardent-quarter-361905
   ```
3. Deploy to Cloud Run:
   ```
    gcloud run deploy --image gcr.io/ardent-quarter-361905/gmp-frontend --project ardent-quarter-361905 --platform managed
    ```
> Read more: https://github.com/vercel/next.js/tree/canary/examples/with-docker#deploying-to-google-cloud-run