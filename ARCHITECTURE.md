# DanceGen AI - System Architecture & Deployment Guide

## 1. System Architecture

The platform follows a microservices-inspired architecture to separate the resource-intensive AI generation from the lightweight web application.

### High-Level Diagram
[Frontend (React)] <--> [API Gateway (Nginx)] <--> [Backend API (FastAPI)] <--> [PostgreSQL]
                                               |
                                               +--> [Redis Queue (Celery)] <--> [AI Worker (GPU/PyTorch)]
                                               |
                                               +--> [Object Storage (S3/GCS)]

## 2. Backend & Infrastructure (Python)

**Tech Stack:**
- **Framework:** FastAPI (High performance async support)
- **Task Queue:** Celery with Redis (for handling long-running video generation jobs)
- **Database:** PostgreSQL (User data, coins, transactions)
- **Storage:** AWS S3 or Google Cloud Storage (Input images, output videos)

**Key API Routes:**
- `POST /auth/signup` - Register user, assign free coins.
- `POST /auth/login` - Return JWT token.
- `GET /users/me` - Get balance and history.
- `POST /generate` - Accepts image + motion_id. Deducts coins. Pushes job to Redis. Returns job_id.
- `GET /jobs/{job_id}` - Poll for status (pending, processing, completed).

## 3. AI Video Generation Engine (Worker Node)

The AI Worker listens to the Redis queue. It should run on a GPU instance (e.g., AWS g4dn.xlarge or Lambda Labs A10).

**Pipeline Logic:**
1. **Pre-processing:**
   - Detect skeleton pose from Input Image using `OpenPose`.
   - Resize/Crop image to 512x768 or 512x512.
2. **Motion Extraction:**
   - Load Reference Video (Motion Template).
   - Extract frame-by-frame skeleton poses using `ControlNet OpenPose`.
3. **Generation (AnimateDiff + ControlNet):**
   - Load Checkpoint: `Stable Diffusion v1.5` or `Realistic Vision`.
   - Load Motion Module: `mm_sd_v15_v2.ckpt` (AnimateDiff).
   - Load ControlNet: `control_v11p_sd15_openpose`.
   - **Inference:** Generate video frames using the input image prompt + skeleton frames as guidance.
4. **Post-processing:**
   - Use `FFmpeg` to stitch frames into MP4.
   - Add background music (optional).
   - Upload to S3.
   - Update Database Job Status to `COMPLETED`.

## 4. Database Schema (SQL)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    coins INTEGER DEFAULT 0,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    is_banned BOOLEAN DEFAULT FALSE
);

CREATE TABLE videos (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    motion_template_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    input_url TEXT,
    output_url TEXT,
    cost INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    amount INTEGER, -- Negative for spend, Positive for buy
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 5. Deployment Guide

### Prerequisites
1.  **Docker & Docker Compose**
2.  **GPU Cloud Provider** (RunPod, Lambda Labs, AWS) for the worker.
3.  **VPS** (DigitalOcean, Hetzner) for Frontend/API/DB.

### Steps
1.  **Frontend:**
    ```bash
    npm install
    npm run build
    # Serve 'dist' folder using Nginx
    ```
2.  **Backend API (Docker):**
    Create `Dockerfile.api`:
    ```dockerfile
    FROM python:3.9
    COPY . /app
    RUN pip install fastapi uvicorn sqlalchemy psycopg2-binary redis boto3
    CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
    ```
3.  **AI Worker (Docker - GPU):**
    Create `Dockerfile.worker`:
    ```dockerfile
    FROM pytorch/pytorch:2.0.1-cuda11.7-cudnn8-runtime
    COPY . /app
    RUN pip install diffusers transformers accelerate controlnet_aux opencv-python ffmpeg-python celery redis
    CMD ["celery", "-A", "worker", "worker", "--loglevel=info"]
    ```
4.  **Orchestration (docker-compose.yml):**
    ```yaml
    services:
      db:
        image: postgres:13
      redis:
        image: redis:6
      api:
        build:
          context: .
          dockerfile: Dockerfile.api
        ports: ["8000:8000"]
        depends_on: [db, redis]
      worker:
        build:
          context: .
          dockerfile: Dockerfile.worker
        deploy:
          resources:
            reservations:
              devices:
                - driver: nvidia
                  count: 1
                  capabilities: [gpu]
    ```

## 6. Admin Panel Details
The frontend code provided includes the Admin routes (`/admin`).
Ensure backend endpoints `/api/admin/users` and `/api/admin/stats` are protected by a middleware that checks `user.role == 'admin'`.

## 7. Scaling
- **Horizontal Scaling:** Run multiple `worker` containers across different GPU nodes.
- **Rate Limiting:** Use Redis to limit users to 1 concurrent generation job.
