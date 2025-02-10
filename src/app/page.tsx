
import PostTableClient from "@/components/custom-components/PostTableClient";

interface Post {
  id: number;
  title: string;
  category: string;
}

export default function Home() {

  return (
    <div>
      <div className="p-4">
        <PostTableClient/>
      </div>
    </div>
  );
}
