# Set up environmental variables
import openai
from dotenv import load_dotenv
import os
load_dotenv()

openai.api_key = os.environ.get("CHAT_GPT_API_KEY") # Set up environmental variable
chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[{"role": "user", "content": "Hello world"}])

def chat_with_gpt3(prompt):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        return f"Error: {e}"
    
user_input = input("You: ")
while user_input.lower() != 'exit':
    response = chat_with_gpt3(user_input)
    print("ChatGPT:", response)
    user_input = input("You: ")