Run the app:  npm run dev

npm install zustand

frontend and backend are already connected through: const WS_URL = "wss://o3tx97i0uc.execute-api.us-east-1.amazonaws.com/dev";

BackEnd Deployed to AWS:
[1] API Gateway (WebSocket)
[2] Lambda functions (handler.ts)
[3]DynamoDB (Clients + Messages)
[4] S3 (future media)

FrontEnd Runs on: http://localhost:5173
Later deployed to:
Vercel / S3 / CloudFront / Netlify (any static hosting)

“Frontend is a client that talks to a live cloud backend via WebSocket”


{For Now}
User browser (anywhere in the world)
        ↓
React frontend (Vercel/S3)
        ↓
WebSocket connection
        ↓
AWS backend (API Gateway + Lambda)


{Final mental model}
        (Frontend React App)
                |
                | WebSocket
                ↓
   AWS API Gateway (WebSocket API)
                |
        Lambda Functions
                |
           DynamoDB