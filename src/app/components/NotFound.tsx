import { Link } from "react-router";
import { Home } from "lucide-react";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button className="bg-green-600">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
