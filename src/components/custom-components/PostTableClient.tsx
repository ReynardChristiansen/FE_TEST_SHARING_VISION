"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PuffLoader } from "react-spinners";

interface Post {
  id: number;
  title: string;
  content: string;
  status: string;
  category: string;
}

const TABS = ["Publish", "Draft", "Thrash"];

export default function PostTableClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Publish");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToTrash, setPostToTrash] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/article/100/0`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleTrashClick = (id: number) => {
    setPostToTrash(id);
    setDeleteModalOpen(true);
  };

  const handleMoveToTrash = async () => {
    if (postToTrash === null) return;

    try {
      const response = await fetch(
        `http://localhost:8080/article/${postToTrash}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Thrash" }),
        }
      );

      if (!response.ok) throw new Error("Failed to move article to trash");

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postToTrash ? { ...post, status: "Thrash" } : post
        )
      );

      setDeleteModalOpen(false);
      setPostToTrash(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredPosts = posts.filter((post) => post.status === activeTab);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <PuffLoader
          color="#1f1f1f"
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
      />
    </div>
  );
  
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col w-96 p-6 bg-white text-red-600 rounded-lg border border-red-200 shadow-lg">
          <h3 className="text-lg font-semibold text-red-600 text-center">
            Oops, something went wrong
          </h3>
          <p className="mt-2 text-sm text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        {TABS.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/edit/${post.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    {post.status !== "Thrash" && (
                      <Button
                        onClick={() => handleTrashClick(post.id)}
                        variant="ghost"
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No posts available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Thrash</DialogTitle>
            <DialogDescription>
              Are you sure you want to move this article to Thrash? You can
              restore it later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleMoveToTrash}>
              Move to Thrash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
