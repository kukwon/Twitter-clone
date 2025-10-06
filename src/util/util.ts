export const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  onFileLoad: (fileData: string) => void
) => {
  const { files } = e.target;
  if (files && files.length === 1) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onFileLoad(result); //파일 데이터를 콜백으로 전달
    };
    reader.readAsDataURL(files[0]);
  }
};
