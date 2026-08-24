import { useRef, useState } from "react";
import api from "../api/axios";

interface ResumeUploadProps {
  onUploadSuccess: () => void;
}

export default function ResumeUpload({onUploadSuccess,}:ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    setSelectedFile(file);
    setMessage("");
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a resume first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("File", selectedFile);

      const response = await api.post(
        "/Resume/upload",
        formData
      );

      console.log("Upload response:", response.data);


      setMessage(
        response.data.message ||
          "Resume uploaded successfully."
      );
       onUploadSuccess();
       
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: unknown) {
      console.error("Resume upload failed:", error);

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { errors?: unknown };
          };
        };

        console.log("Status:", axiosError.response?.status);

        console.log(
          "Validation errors:",
          JSON.stringify(
            axiosError.response?.data?.errors,
            null,
            2
          )
        );
      }

      setMessage("Resume upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Upload Resume
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Upload your resume in PDF format and let AI analyze it.
        </p>
      </div>

      <div
        onClick={handleChooseFile}
        className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-10 text-center transition hover:border-cyan-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-cyan-500 dark:hover:bg-slate-900"
      >
        <div className="text-4xl">
          📄
        </div>

        <h3 className="mt-4 font-medium text-slate-900 dark:text-white">
          Choose your resume
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          PDF files only
        </p>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleChooseFile();
          }}
          className="mt-5 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          Choose PDF
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {selectedFile && (
        <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {selectedFile.name}
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="ml-4 shrink-0 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

        </div>
      )}

      {message && (
        <div className="mt-4 rounded-lg bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {message}
        </div>
      )}
    </div>
  );
}