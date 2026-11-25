
import os
import httpx
from dotenv import load_dotenv

load_dotenv()


class GroqService:

    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.model = os.getenv(
            "GROQ_MODEL",
            "openai/gpt-oss-120b"
        )
        self.api_url = (
            "https://api.groq.com/openai/v1/chat/completions"
        )

        if not self.api_key:
            raise ValueError(
                "GROQ_API_KEY is missing in .env file"
            )

    async def generate_answer(
        self,
        question: str,
        context: str
    ):
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        system_prompt = """
        You are an AI Resume Assistant.

        Answer the user's question using only the resume
        information provided in the context.

        Rules:
        1. Do not invent skills, experience, education or projects.
        2. If the answer is not available in the context,
           clearly say that the resume does not provide
           enough information.
        3. Give clear and professional answers.
        4. Do not assume information that is not present
           in the resume.
        """

        user_prompt = f"""
        Resume Context:
        {context}

        User Question:
        {question}

        Answer based only on the resume context above.
        """

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            "temperature": 0.3,
            "max_tokens": 700
        }

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                self.api_url,
                headers=headers,
                json=payload
            )

            if response.status_code != 200:
                raise Exception(
                    f"Groq returned {response.status_code}: {response.text}"
                )

            result = response.json()

            return result["choices"][0]["message"]["content"]


groq_service = GroqService()
