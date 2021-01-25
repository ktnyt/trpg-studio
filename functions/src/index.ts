import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as crypto from "crypto";
import { nanoid } from "nanoid";

admin.initializeApp();

const db = admin.firestore();

const computeHash = (...args: string[]) =>
  crypto.createHash("sha256").update(args.join("")).digest("hex");

export const setPassword = functions.https.onCall(
  async ({ id, referrer, token: current, password }) => {
    const ref = db.collection("passwords").doc(id);
    const doc = await ref.get();
    if (doc.exists) {
      const data = doc.data();
      if (data !== undefined) {
        const secret = computeHash(referrer, current);
        if (secret !== data.secret) {
          throw new functions.https.HttpsError(
            "permission-denied",
            `Incorrect password for character with id '${id}'`,
          );
        }
      }
    }

    const salt = nanoid();
    const hash = computeHash(password, salt);
    const token = nanoid();
    const secret = computeHash(referrer, token);
    await ref.set({ hash, salt, secret });
    return token;
  }
);

export const hasPassword = functions.https.onCall(
  async ({ id }) => {
    const ref = db.collection("passwords").doc(id);
    const doc = await ref.get();
    return doc.exists && doc.data() !== undefined;
  }
);

export const verifyPassword = functions.https.onCall(
  async ({ id, referrer, password }) => {
    const ref = db.collection("passwords").doc(id);
    const doc = await ref.get();
    if (!doc.exists) {
      return "";
    }

    const data = doc.data();
    if (data === undefined) {
      return "";
    }

    const { hash, salt } = data;
    if (hash !== computeHash(password, salt)) {
      throw new functions.https.HttpsError(
        "permission-denied",
        `Incorrect password for character with id '${id}'`,
      );
    }

    const token = nanoid();
    const secret = computeHash(referrer, token);
    await ref.update({ secret });
    return token;
  }
);

const getId = async (): Promise<string> => {
  let id = nanoid();
  let ref = db.collection("characters").doc(id);
  let doc = await ref.get();
  while (doc.exists) {
    id = nanoid();
    ref = db.collection("characters").doc(id);
    doc = await ref.get();
  }
  return id;
};

export const addCharacter = functions.https.onCall(
  async ({ character }) => {
    const id = await getId();
    await db.collection("characters").doc(id).set(character);
    return id;
  }
);

export const getCharacter = functions.https.onCall(
  async ({ id }) => {
    const ref = db.collection("characters").doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        `A character with id '${id}' does not exist`,
      );
    }

    return doc.data();
  }
);

export const setCharacter = functions.https.onCall(
  async ({ id, referrer, token, character }) => {
    const ref = db.collection("characters").doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        `A character with id '${id}' does not exist`,
      );
    }

    const creds = await db.collection("passwords").doc(id).get();
    if (creds.exists) {
      const data = creds.data();
      if (data !== undefined) {
        const secret = computeHash(referrer, token);
        if (secret !== data.secret) {
          throw new functions.https.HttpsError(
            "permission-denied",
            `Incorrect password for character with id '${id}'`,
          );
        }
      }
    }

    await ref.set(character);
  }
);

export const updateCharacter = functions.https.onCall(
  async ({ id, referrer, token, patch }) => {
    const ref = db.collection("characters").doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        `A character with id '${id}' does not exist`,
      );
    }

    const creds = await db.collection("passwords").doc(id).get();
    if (creds.exists) {
      const data = creds.data();
      if (data !== undefined) {
        const secret = computeHash(referrer, token);
        if (secret !== data.secret) {
          throw new functions.https.HttpsError(
            "permission-denied",
            `Incorrect password for character with id '${id}'`,
          );
        }
      }
    }

    await ref.update(patch);
  }
);
