import express from "express";
import cors from "cors";
import { firestore, rtdb } from "./db.js";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

const roomCollection = firestore.collection("rooms");

app.post("/room", async function (req, res) {
  const { userName } = req.body;

  const rtdbRoomRef = rtdb.ref("/rps/rooms/" + nanoid());

  const currentGame = {
    [userName]: { choice: "", online: true, start: false },
  };

  await rtdbRoomRef.set({ currentGame });

  const rtdbRoomId = rtdbRoomRef.key;
  const roomId = 1000 * Math.floor(Math.random() * 999);

  await roomCollection.doc(roomId.toString()).set({ rtdbRoomId, history: [] });

  res.status(201).json({ roomId: roomId.toString(), rtdbRoomId });
});

app.get("/room/:roomId", async function (req, res) {
  const { roomId } = req.params;

  const roomDoc = await roomCollection.doc(roomId.toString()).get();

  if (!roomDoc.exists) {
    res.status(404).json({ error: "Room not found" });
  } else {
    const roomData = roomDoc.data();

    res.status(200).json({ rtdbRoomId: roomData?.rtdbRoomId });
  }
});

app.get("/room/:roomId/history", async function (req, res) {
  const { roomId } = req.params;

  const roomDoc = await roomCollection.doc(roomId.toString()).get();

  if (!roomDoc.exists) {
    res.status(404).json({ error: "Room not found" });
  } else {
    const roomData = roomDoc.data();

    res.status(200).json({ history: roomData?.history });
  }
});

app.post("/room/:roomId/history", async function (req, res) {
  const { roomId } = req.params;

  const roomRef = roomCollection.doc(roomId.toString());

  await roomRef.set(req.body, { merge: true });

  res.status(201).json({ message: "Room history updated" });
});

app.post("/rtdb/room/:rtdbRoomId", async function (req, res) {
  const { rtdbRoomId } = req.params;
  const { userName } = req.query;

  const currentGameRef = rtdb.ref("/rps/rooms/" + rtdbRoomId + "/currentGame");

  const snapshot = await currentGameRef.once("value");

  const numChildren = snapshot.numChildren();
  const data = snapshot.val();

  if (numChildren < 2 || data[userName as string]) {
    currentGameRef.child(userName as string).set(req.body);

    res.json({ message: "Player data added or updated" });
  } else {
    res.status(403).json({ error: "Room is full" });
  }
});

app.use(express.static("dist"));

const relativeRoute = path.resolve(__dirname, "../dist/", "index.html");

app.get("*", (req, res) => {
  res.sendFile(relativeRoute);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
