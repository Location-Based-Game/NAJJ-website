import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebaseConfig";

type ScoreData = {
  username: string;
  highScore: number;
};

export default async function Leaderboard() {
  const scores = collection(db, "leaderboard");
  const q = query(scores, orderBy("highScore"));
  const querySnapshot = await getDocs(q);

  const data: ScoreData[] = [];
  querySnapshot.forEach((doc) => {
    data.push(doc.data() as ScoreData);
  });

  data.reverse();

  return (
    <div className="w-full flex flex-col items-center py-20 h-full">
      <h2 className="font-header w-full text-center text-4xl bg-gradient-to-b from-white from-70% to-transparent text-transparent bg-clip-text">
        Leaderboard
      </h2>
      <div className="w-full mt-8 xl:w-[900px] px-12">
        {data.map((e, i) => {
          return <Item key={i} index={i} data={e} />;
        })}
      </div>
    </div>
  );
}

interface Item {
  data: ScoreData;
  index: number;
}

function Item({ data, index }: Item) {
  return (
    <div
      key={index}
      className={`flex justify-between bg-black px-16 py-4 ${
        index % 2 ? "bg-opacity-50" : "bg-opacity-40"
      }`}
    >
      <div className="flex gap-10">
        <div className="w-5 font-bold text-right">{index + 1}</div>
        <div>{data.username}</div>
      </div>
      <div>{data.highScore}</div>
    </div>
  );
}
