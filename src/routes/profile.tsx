import styled from "styled-components";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { handleFileChange } from "../util/util";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState<string | null>(null);

  //페이지 접속 시 avatar 정보 가져오기
  useEffect(() => {
    if (!user) return;

    const usersCollectionRef = collection(db, "user");
    const q = query(usersCollectionRef, where("userId", "==", user?.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs;

      if (docs.length > 0) {
        //사용자 데이턱 존재하면 avatar 값 설정
        const userData = docs[0].data();
        setAvatar(userData.avatar || user?.photoURL || null);
      } else {
        //사용자 데이터가 없으면 기본값으로 설정
        setAvatar(user?.photoURL || null);
      }
    });

    return () => unsubscribe(); //구독 해제
  }, [user]);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      handleFileChange(e, async (fileData) => {
        if (!avatar) {
          //avatar 값이 없을 때 새 문서 추가
          await addDoc(collection(db, "users"), {
            avatar: fileData,
            userId: user?.uid,
          });
        } else {
          //avatar 값이 존재하면 업데이트
          const usersCollectionRef = collection(db, "users");
          const q = query(usersCollectionRef, where("userId", "==", user?.uid));
          onSnapshot(q, (querySnapshot) => {
            querySnapshot.docs.forEach((docSnapshot) => {
              updateDoc(docSnapshot.ref, { avatar: fileData });
            });
          });
        }
        setAvatar(fileData);
        //상태 업데이트
      });
    }
  };

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ?? "Anonymous"}</Name>
    </Wrapper>
  );
}
