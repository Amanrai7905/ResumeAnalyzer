
from fastapi import FastAPI

from app.api.resume import router as resume_router

app = FastAPI(
    title="Resume Analyzer RAG API",
    description="Python-based RAG Microservice for AI Resume Analyzer",
    version="1.0.0"
)


@app.get("/")
async def home():

    return {
        "message": "Resume Analyzer RAG API is running"
    }


@app.get("/health")
async def health_check():

    return {
        "status": "Healthy"
    }


# Register Resume RAG APIs
app.include_router(resume_router)
