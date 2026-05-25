export type YoutubeVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
};

export async function searchExerciseVideo(exerciseName: string): Promise<YoutubeVideo | null> {
  const query = encodeURIComponent(`${exerciseName} exercise tutorial`);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;

  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
  };
}
