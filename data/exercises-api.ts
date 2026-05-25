export type ApiExercise = {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  secondaryMuscles: string[];
  instructions: string[];
  description: string;
  difficulty: string;
  category: string;
};

const BASE_URL = "https://exercisedb.p.rapidapi.com";

const headers = {
  "X-RapidAPI-Key": process.env.EXERCISEDB_API_KEY!,
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};

export async function searchExercises(query: string): Promise<ApiExercise[]> {
  const res = await fetch(
    `${BASE_URL}/exercises/name/${encodeURIComponent(query.toLowerCase())}?limit=20&offset=0`,
    { headers, next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error("Failed to fetch exercises");
  return res.json();
}

export async function getExercisesByBodyPart(bodyPart: string): Promise<ApiExercise[]> {
  const res = await fetch(
    `${BASE_URL}/exercises/bodyPart/${encodeURIComponent(bodyPart)}?limit=20&offset=0`,
    { headers, next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error("Failed to fetch exercises");
  return res.json();
}

export async function getExerciseById(id: string): Promise<ApiExercise> {
  const res = await fetch(
    `${BASE_URL}/exercises/exercise/${id}`,
    { headers, next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error("Exercise not found");
  return res.json();
}

export async function getBodyPartList(): Promise<string[]> {
  const res = await fetch(
    `${BASE_URL}/exercises/bodyPartList`,
    { headers, next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error("Failed to fetch body parts");
  return res.json();
}

export async function getDefaultExercises(): Promise<ApiExercise[]> {
  const res = await fetch(
    `${BASE_URL}/exercises?limit=20&offset=0`,
    { headers, next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error("Failed to fetch exercises");
  return res.json();
}
