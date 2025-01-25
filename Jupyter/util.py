import os
from anthropic import Anthropic
import re
from dotenv import find_dotenv, load_dotenv

# Load environment variables from the project root's .env file
load_dotenv(find_dotenv(usecwd=True))

def llm_call(prompt: str) -> str:
    """Make a call to Claude API and return the response."""
    client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    if not client.api_key:
        raise ValueError("ANTHROPIC_API_KEY environment variable not set")
        
    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text

def extract_xml(text: str, tag: str) -> str:
    """Extract content between XML tags."""
    pattern = f"<{tag}>(.*?)</{tag}>"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return ""
