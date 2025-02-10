import { Button } from "@/components/ui/button";
import { Pencil, Plus, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div>
      <nav className="sticky top-0 bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
        <h1 className="text-lg font-semibold hidden sm:block">Dashboard</h1>
        <div className="flex space-x-3">
          <Link href="/">
            <Button variant="outline" size="sm">
              All Posts
            </Button>
          </Link>
          <Link href="/add">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add New
            </Button>
          </Link>
          <Link href="/preview">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" /> Preview
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}
