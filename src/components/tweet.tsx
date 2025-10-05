import styled from "styled-components";
import type { ITweet } from "./timeline";
import { auth, db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import UpdateTweetForm from "./edit-tweet-form";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  background-color: white;
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({
  username,
  tweet,
  fileData,
  userId,
  id,
}: ITweet) {
  const user = auth.currentUser;
  const [update, setUpdate] = useState(false);
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");

    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
    } catch (error) {
      console.log(error);
    } finally {
      //
    }
  };

  const onUpdate = async () => {
    if (!update) {
      setUpdate(true);
      return;
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {!update ? (
          <Payload>{tweet}</Payload>
        ) : (
          <UpdateTweetForm
            id={id}
            setUpdate={setUpdate}
            afterFile={fileData}
            afterTweet={tweet}
          />
        )}
        {user?.uid === userId ? (
          <>
            <EditButton onClick={onUpdate}>Edit</EditButton>
            &nbsp;
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
          </>
        ) : null}
      </Column>
      <Column>{fileData ? <Photo src={fileData} /> : null}</Column>
    </Wrapper>
  );
}
