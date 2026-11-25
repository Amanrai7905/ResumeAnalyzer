
from pydantic import BaseModel, Field
from typing import Union


class ResumeIngestRequest(BaseModel):
    resume_id: str
    resume_text: str = Field(min_length=1)



class ResumeIngestResponse(BaseModel):
    message: str
    resume_id: str
    chunks_count: int
    embeddings_count: int
    embedding_dimension: int



class ResumeChatRequest(BaseModel):
    resume_id: str
    question: str = Field(min_length=1)
    top_k: int = Field(default=3, ge=1, le=10)


class ResumeChatResponse(BaseModel):
    answer: str
    resume_id: str
    retrieved_chunks: list[str]

class ResumeSearchRequest(BaseModel):
    resume_id: str
    question: str = Field(min_length=1)
    top_k: int = Field(default=3, ge=1, le=10)


class ResumeSearchResult(BaseModel):
    chunk: str
    distance: float
    metadata: dict[str, Union[str, int]]

class ResumeSearchResponse(BaseModel):
    resume_id: str
    question: str
    results: list[ResumeSearchResult]