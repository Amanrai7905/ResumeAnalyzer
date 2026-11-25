
import re


def chunk_text(
    text: str,
    chunk_size: int = 800,
    chunk_overlap: int = 100
) -> list[str]:

    if not text or not text.strip():
        return []

    if chunk_size <= 0:
        raise ValueError("Chunk size must be greater than zero")

    if chunk_overlap < 0 or chunk_overlap >= chunk_size:
        raise ValueError(
            "Chunk overlap must be non-negative and smaller than chunk size"
        )

    # Clean resume text while preserving line boundaries
    lines = [
        re.sub(r"[ \t]+", " ", line).strip()
        for line in text.replace("\r", "").split("\n")
    ]

    cleaned_text = "\n".join(
        line for line in lines if line
    )

    # Split text into sentences and meaningful lines
    units = re.split(
        r"(?<=[.!?])\s+|\n+",
        cleaned_text
    )

    chunks = []
    current_chunk = ""

    for unit in units:

        unit = unit.strip()

        if not unit:
            continue

        # Handle a single sentence larger than chunk size
        if len(unit) > chunk_size:

            if current_chunk:
                chunks.append(current_chunk)
                current_chunk = ""

            words = unit.split()
            piece = ""

            for word in words:

                if len(piece) + len(word) + 1 <= chunk_size:
                    piece = f"{piece} {word}".strip()

                else:
                    if piece:
                        chunks.append(piece)

                    piece = word

            if piece:
                current_chunk = piece

            continue

        # Add sentence to current chunk
        candidate = (
            f"{current_chunk}\n{unit}"
            if current_chunk else unit
        )

        if len(candidate) <= chunk_size:

            current_chunk = candidate

        else:

            if current_chunk:
                chunks.append(current_chunk)

            # Preserve context using overlap
            overlap_text = (
                current_chunk[-chunk_overlap:]
                if chunk_overlap > 0 else ""
            )

            current_chunk = (
                f"{overlap_text}\n{unit}"
                if overlap_text else unit
            )

    if current_chunk:
        chunks.append(current_chunk)

    return chunks
