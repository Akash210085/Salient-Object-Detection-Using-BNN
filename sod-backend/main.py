from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from io import BytesIO
from PIL import Image
import numpy as np
import cv2

# Dummy placeholder function (replace with your BNN model)
def predict_salient_object(image: Image.Image) -> Image.Image:
    # Convert PIL image to OpenCV format (numpy array)
    image_cv = np.array(image.convert("RGB"))
    image_gray = cv2.cvtColor(image_cv, cv2.COLOR_RGB2GRAY)

    # Apply Canny Edge Detection
    edges = cv2.Canny(image_gray, threshold1=100, threshold2=200)

    # Convert the result back to a PIL Image
    edge_image = Image.fromarray(edges)

    return edge_image
    

app = FastAPI()

# Allow requests from frontend (React runs on localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://salient-object-detection-using-bnn-1.onrender.com"],  # Replace "*" with specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-image")
async def process_image(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    print(f"Received image: {file.filename}")
    print(f"Image size: {image.size}")
    result = predict_salient_object(image)

    buffer = BytesIO()
    result.save(buffer, format="PNG")
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="image/png")




# uvicorn main:app --reload --host 0.0.0.0 --port 8000
# To run the server, use the command: