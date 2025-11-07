// =============================================
// 📤 upload.ts — Subida de archivos al backend
// =============================================

export const uploadFile = async (file: File, token: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Error al subir archivo");

  const data = await response.json();
  return data.url;
};
