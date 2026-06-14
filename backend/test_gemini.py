import os

from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

jls_extract_var = "GEMINI_API_KEY"
genai.configure(api_key=os.getenv(jls_extract_var))


for model in genai.list_models():
    print(model.name)