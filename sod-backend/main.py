from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from io import BytesIO
from PIL import Image

# Dummy placeholder function (replace with your BNN model)
def predict_salient_object(image: Image.Image) -> Image.Image:
    return image.convert("L")  # Just grayscale for now

app = FastAPI()

# Allow requests from frontend (React runs on localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    result = predict_salient_object(image)

    buffer = BytesIO()
    result.save(buffer, format="PNG")
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="image/png")




# uvicorn main:app --reload --host 0.0.0.0 --port 8000
# To run the server, use the command: