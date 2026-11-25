
from sentence_transformers import SentenceTransformer


class EmbeddingService:

    def __init__(self):

        # Load the embedding model once
        self.model = SentenceTransformer(
            "sentence-transformers/all-MiniLM-L6-v2"
        )

    def generate_embeddings(
        self,
        texts: list[str]
    ) -> list[list[float]]:

        if not texts:
            return []

        # Convert text into numerical vectors
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True
        )

        # Convert NumPy arrays into Python lists
        return embeddings.tolist()


# Create one reusable service instance
embedding_service = EmbeddingService()
