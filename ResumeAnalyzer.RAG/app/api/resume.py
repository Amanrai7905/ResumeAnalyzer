from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store
from app.services.groq_service import groq_service
from fastapi import APIRouter, HTTPException

from app.schemas.resume import (
    ResumeIngestRequest,
    ResumeIngestResponse,
    ResumeChatRequest,
    ResumeChatResponse,
    ResumeSearchRequest,
    ResumeSearchResponse,
    ResumeSearchResult
)

from app.services.text_chunker import chunk_text


router = APIRouter(
    prefix="/api/resumes",
    tags=["Resume RAG"]
)



@router.post(
    "/ingest",
    response_model=ResumeIngestResponse
)
async def ingest_resume(request: ResumeIngestRequest):

    try:

        # Step 1: Divide resume into chunks
        chunks = chunk_text(
            text=request.resume_text,
            chunk_size=800,
            chunk_overlap=100
        )

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No valid resume text found"
            )

        # Step 2: Generate embeddings
        embeddings = embedding_service.generate_embeddings(
            chunks
        )

        # Step 3: Store chunks and embeddings
        stored_count = vector_store.store_resume_chunks(
            resume_id=request.resume_id,
            chunks=chunks,
            embeddings=embeddings
        )

        # Step 4: Get embedding dimensions
        embedding_dimension = len(embeddings[0])

        return ResumeIngestResponse(
            message="Resume successfully stored in ChromaDB",
            resume_id=request.resume_id,
            chunks_count=len(chunks),
            embeddings_count=len(embeddings),
            embedding_dimension=embedding_dimension
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Resume ingestion failed: {str(error)}"
        )

    


@router.post("/chat", response_model=ResumeChatResponse)
async def chat_with_resume(request: ResumeChatRequest):

    try:
        # Step 1: Generate embedding for user question
        question_embeddings = (
            embedding_service.generate_embeddings(
                [request.question]
            )
        )

        query_embedding = question_embeddings[0]

        # Step 2: Retrieve relevant resume chunks
        search_results = vector_store.search_resume_chunks(
            resume_id=request.resume_id,
            query_embedding=query_embedding,
            top_k=request.top_k
        )

        # Step 3: Check whether relevant information exists
        if not search_results:
            return ResumeChatResponse(
                answer="I could not find information for this resume. Please check the resume ID or upload the resume first.",
                resume_id=request.resume_id,
                retrieved_chunks=[]
            )

        # Step 4: Combine retrieved chunks into context
        context = "\n\n".join(
            result["chunk"]
            for result in search_results
        )

        # Step 5: Send question and context to Groq
        answer = await groq_service.generate_answer(
            question=request.question,
            context=context
        )

        # Step 6: Return AI answer and retrieved chunks
        return ResumeChatResponse(
            answer=answer,
            resume_id=request.resume_id,
            retrieved_chunks=[
                result["chunk"]
                for result in search_results
            ]
        )

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Resume chat failed: {str(error)}"
        )



@router.get("/vector-count")
async def get_vector_count():

    count = vector_store.get_collection_count()

    return {
        "total_vectors": count
    }

@router.post("/search", response_model=ResumeSearchResponse)
async def search_resume(request: ResumeSearchRequest):
    try:
        # Step 1: Generate embedding for the user's question
        question_embeddings = embedding_service.generate_embeddings(
            [request.question]
        )

        query_embedding = question_embeddings[0]

        # Step 2: Search relevant chunks in ChromaDB
        search_results = vector_store.search_resume_chunks(
            resume_id=request.resume_id,
            query_embedding=query_embedding,
            top_k=request.top_k
        )

        # Step 3: Return retrieved chunks
        return ResumeSearchResponse(
            resume_id=request.resume_id,
            question=request.question,
            results=[
                ResumeSearchResult(**result)
                for result in search_results
            ]
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Resume search failed: {str(error)}"
        )


@router.get("/groq-test")
async def test_groq():

    try:
        answer = await groq_service.generate_answer(
            "Explain what ASP.NET Core is in two sentences."
        )

        return {
            "message": "Groq API connected successfully",
            "answer": answer
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Groq API failed: {str(error)}"
        )