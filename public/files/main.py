import re
from docx import Document
import json

# Load the .docx file
doc = Document("MriduMCU.docx")

questions = []
current_question = None

# Helper function to add a question
def add_question(question, choices, answer, question_type):
    """Add a question to the list of questions."""
    if question and choices:
        questions.append({
            "question": question.strip(),
            "choices": choices,
            "answer": answer.strip() if answer else None,
            "question_type": question_type
        })

# Regular expression to detect questions
question_pattern = re.compile(r"^(Wh\w+|How|Explain|Define|Describe).*|.*\?$|.*\b(is:|are:|:)$")

# Parse the document
for para in doc.paragraphs:
    text = para.text.strip()
    if not text:
        continue

    # Determine the type of the question
    if question_pattern.match(text):
        # Save the previous question before starting a new one
        if current_question:
            add_question(current_question["question"], current_question["choices"], current_question["answer"], current_question["question_type"])
        # Start a new question
        question_type = "multiple_choice" if text.endswith("?") else "descriptive"
        current_question = {"question": text, "choices": [], "answer": None, "question_type": question_type}
    elif text.startswith("+"):  # Correct answer
        if current_question:
            current_question["choices"].append(text[1:].strip())  # Add without the "+" symbol
            current_question["answer"] = text[1:].strip()         # Mark as the correct answer
    else:  # Other choices
        if current_question:
            current_question["choices"].append(text)

# Add the last question
if current_question:
    add_question(current_question["question"], current_question["choices"], current_question["answer"], current_question["question_type"])

# Save to JSON
with open("questions.json", "w") as f:
    json.dump(questions, f, indent=4)

print("Questions saved to questions.json")
