
import * as React from 'react';
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { ImageUp } from 'lucide-react';
import HashLoader from "react-spinners/HashLoader";
export default function App() {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prevInputs, setPrevInputs] = useState<string[]>([]);
  const [prevOutputs, setPrevOutputs] = useState<string[]>([]);


  interface FileUploadEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleUpload = async (e: FileUploadEvent): Promise<void> => {
    const file = e.target.files[0];

    // Store current images to history
    if (inputImage) setPrevInputs((prev) => [inputImage, ...prev]);
    if (outputImage) setPrevOutputs((prev) => [outputImage, ...prev]);

    setInputImage(URL.createObjectURL(file));
    setOutputImage(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res: Response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/process-image`, {
        method: "POST",
        body: formData,
      });
      const blob: Blob = await res.blob();
      setOutputImage(URL.createObjectURL(blob));
    } catch (err: unknown) {
      alert("Something went wrong while processing the image.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Salient Object Detection Using Binary Neural Network
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex justify-center">
          <label
            className="min-w-[16rem] w-full max-w-sm cursor-pointer px-6 py-3 bg-white text-black rounded-lg border border-blue-500 relative overflow-hidden group focus:outline-none hover:shadow-lg transition flex items-center justify-center space-x-2"
          >
            {/* Content stays on top */}
            <div className="flex items-center space-x-2 relative z-10">
              <ImageUp color="blue" />
              <span>Browse...</span>
            </div>

            {/* Ripple effect fills fully */}
            <span
              className="absolute inset-0 bg-blue-100 opacity-0 group-active:opacity-100 group-active:animate-ripple z-0"
            ></span>

            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {inputImage && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">Input Image</h2>
                <img src={inputImage} alt="input" className="rounded" />
              </CardContent>
            </Card>
          )}

          {loading && inputImage && (
            <Card className="flex items-center justify-center">
              <CardContent className="flex flex-col items-center justify-center p-4">
                <HashLoader color="#76bbbf" />
                <p className="mt-4 text-gray-600 text-lg font-medium flex items-center">
                  Processing
                  <span className="dot-animation ml-1 w-4 h-4 flex items-center justify-center">
                    <span className="dot dot-1">.</span>
                    <span className="dot dot-2">.</span>
                    <span className="dot dot-3">.</span>
                  </span>
                </p>
              </CardContent>
            </Card>
          )}

          {inputImage && outputImage && (
            <Card>
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">Output Image</h2>
                <img src={outputImage} alt="output" className="rounded" />
                <a
                  href={outputImage}
                  download="sod_output.png"
                  className="block text-blue-600 mt-2 underline"
                >
                  Download Output
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {prevInputs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">Previous Input Images</h2>
              <div className="space-y-4">
                {prevInputs.map((img, idx) => (
                  <Card key={`prev-input-${idx}`}>
                    <CardContent className="p-4">
                      <img src={img} alt={`prev-input-${idx}`} className="rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">Previous Output Images</h2>
              <div className="space-y-4">
                {prevOutputs.map((img, idx) => (
                  <Card key={`prev-output-${idx}`}>
                    <CardContent className="p-4">
                      <img src={img} alt={`prev-output-${idx}`} className="rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
