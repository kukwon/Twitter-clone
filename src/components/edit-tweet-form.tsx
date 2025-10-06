import styled from "styled-components";
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase.ts";
import { handleFileChange } from "../util/util.ts";

interface UpdateTweetFormProps {
  id: string;
  setUpdate: (value: boolean) => void;
  afterTweet: string;
  afterFile?: string;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: pre-wrap;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const CancelBtn = styled.input`
  background-color: gray;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
`;

export default function UpdateTweetForm({
  id,
  setUpdate,
  afterFile,
  afterTweet,
}: UpdateTweetFormProps) {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [changeFile, setChangeFile] = useState(false);
  const [message, setMessage] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  // base64 인코딩
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, (fileData) => {
      setFile(fileData); //상태 업데이트
      setChangeFile(true);
    });
    // const { files } = e.target;
    // if (files && files.length === 1) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     const result = reader.result as string;
    //     console.log("File data encoded:", result); // 확인 로그 추가
    //     setFile(result); // 상태 업데이트
    //     setChangeFile(true);
    //   };
    //   reader.readAsDataURL(files[0]);
    // }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    console.log("Submitting tweet:", tweet);
    console.log("Submitting file:", file); // 상태 확인
    try {
      setLoading(true);
      await updateDoc(doc(db, "tweets", id), {
        tweet,
        fileData: file,
        createAt: Date.now(),
      });
    } catch (e) {
      console.log(e);
    } finally {
      setUpdate(false);
      setLoading(false);
      setTweet("");
    }
  };

  const onCancel = () => {
    setUpdate(false);
    setTweet("");
    setLoading(false);
  };

  useEffect(() => {
    if (!afterFile) return;
    setFile(afterFile);
    setTweet(afterTweet);
  }, []);
  useEffect(() => {
    if (changeFile && file) {
      setMessage("Update Photo✅");
    } else if (!changeFile && file) {
      setMessage("Added Photo✅   Do you want Change?");
    } else if (!changeFile && !file) {
      setMessage("Add Photo");
    }
  }, [changeFile, file]);
  return (
    <>
      <Form onSubmit={onSubmit}>
        <TextArea
          rows={5}
          maxLength={180}
          onChange={onChange}
          value={tweet}
          placeholder={"What is happening?"}
        />
        <AttachFileButton htmlFor={"updateFile"}>{message}</AttachFileButton>
        <AttachFileInput
          onChange={onFileChange}
          type={"file"}
          id={"updateFile"}
          accept={"image/*"}
        />
        <CancelBtn onClick={onCancel} type="button" value="cancel" />

        <SubmitBtn
          type={"submit"}
          value={isLoading ? "Updating..." : "Update Tweet"}
        />
      </Form>
    </>
  );
}
