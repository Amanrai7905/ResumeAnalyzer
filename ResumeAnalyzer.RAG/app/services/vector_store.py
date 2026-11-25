
import chromadb
from pathlib import Path


class VectorStore:

    def __init__(self):
        project_root = Path(__file__).resolve().parents[2]
        db_path = project_root / "chroma_db"

        self.client = chromadb.PersistentClient(
            path=str(db_path)
        )

        self.collection = self.client.get_or_create_collection(
            name="resumes",
            metadata={"hnsw:space": "cosine"},
            embedding_function=None
        )

    def store_resume_chunks(
        self,
        resume_id: str,
        chunks: list[str],
        embeddings: list[list[float]]
    ):
        if len(chunks) != len(embeddings):
            raise ValueError("Chunks and embeddings count must match")

        if not chunks:
            raise ValueError("No chunks to store")

        self.collection.delete(
            where={"resume_id": resume_id}
        )

        ids = [
            f"{resume_id}_chunk_{index}"
            for index in range(len(chunks))
        ]

        metadatas = [
            {
                "resume_id": resume_id,
                "chunk_index": index
            }
            for index in range(len(chunks))
        ]

        self.collection.add(
            ids=ids,
            documents=chunks,
            embeddings=embeddings,
            metadatas=metadatas
        )

        return len(chunks)

    # NEW METHOD: Search relevant resume chunks
    def search_resume_chunks(
        self,
        resume_id: str,
        query_embedding: list[float],
        top_k: int = 3
    ):

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where={"resume_id": resume_id},
            include=[
                "documents",
                "metadatas",
                "distances"
            ]
        )

        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        search_results = []

        for document, metadata, distance in zip(
            documents,
            metadatas,
            distances
        ):
            search_results.append({
                "chunk": document,
                "metadata": metadata,
                "distance": float(distance)
            })

        return search_results

    def get_collection_count(self):
        return self.collection.count()


vector_store = VectorStore()
