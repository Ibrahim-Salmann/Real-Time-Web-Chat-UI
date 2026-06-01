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



Sidebar
   ↓
select Ali
   ↓
request history
   ↓
Lambda
   ↓
DynamoDB
   ↓
return messages
   ↓
render ChatWindow



{What my architect looks like}

Browser / React UI
        │
        │ WebSocket
        ▼
API Gateway (WebSocket API)
        │
        ▼
Lambda Function
        │
 ┌──────┴──────────┐
 ▼                 ▼
DynamoDB        API Gateway
(Stores Data)   (Sends Messages)




Notes to learn and keep in mind{
        Think of Lambda as:A function AWS runs for you only when needed
        Lambda is stateless: it doesn't remember anything between runs
        Instead of: [Your computer, running 24/7, waiting for requests]
        AWS does: [
                   Request arrives
                        ↓
                   Start Lambda
                        ↓
                   Run code
                        ↓
                   Return result
                        ↓
                  Destroy Lambda
                  ]
        Lambda is event driven
        Lambda can be triggered by: HTTP requests, WebSocket messages, file uploads, database changes, scheduled timers, and more
        Like when user connects AWS creates Lambda execution runs handleconnect() then returns; Lambda goes idle

        Since Lambda forgets DynamoDB is needed as a permanent storage, Serverless nonsql database

        S3 is a harddrive in cloud

}

API Gateway = receptionist
     Receives requests
Lambda = worker
     Executes code
DynamoDB = filing cabinet
     Stores structured data
S3 = warehouse
     Stores files
CloudWatch = security camera
     Records everything
Serverless Framework = construction company
     Builds and configures all the AWS resources from your serverless.yml file.
