/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface UploadContextType {
  pendingFile: File | null;
  setPendingFile: (file: File | null) => void;

  shouldAutoUpload: boolean;
  setShouldAutoUpload: (value: boolean) => void;
}

const UploadContext = createContext<
  UploadContextType | undefined
>(undefined);

export function UploadProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [pendingFile, setPendingFile] =
    useState<File | null>(null);

  const [shouldAutoUpload, setShouldAutoUpload] =
    useState(false);

  return (
    <UploadContext.Provider
      value={{
        pendingFile,
        setPendingFile,
        shouldAutoUpload,
        setShouldAutoUpload,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);

  if (!context) {
    throw new Error(
      "useUpload must be used within UploadProvider"
    );
  }

  return context;
}