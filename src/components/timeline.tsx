import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import type { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  fileData?: string;
  tweet: string;
  userId: string;
  username: string;
  createAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25) //25개만 불러오기
      );
      // const snapshot = await getDocs(tweetsQuery);
      // const tweets = snapshot.docs.map((doc) => {
      //   const { fileData, tweet, userId, username, createAt } = doc.data();
      //   return {
      //     fileData,
      //     tweet,
      //     userId,
      //     username,
      //     createAt,
      //     id: doc.id,
      //   };
      // });
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { fileData, tweet, userId, username, createAt } = doc.data();
          return {
            fileData,
            tweet,
            userId,
            username,
            createAt,
            id: doc.id,
          };
        });
        setTweet(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe(); //유저가 로그아웃했거나, 다른화면에 있을 때 굳이 이벤트를 들을 필요가 없기 때문에 useEffect의 teat down or cleanup 기능 사용
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
