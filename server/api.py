from fastapi import FastAPI, File
from azure_form_recognizer import AzureFormRecognizer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/extract-tables/")
async def create_file(file: bytes = File()):
    return AzureFormRecognizer.get(file)
