import { Link } from "react-router";
import { Home, Sprout } from "lucide-react";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <span className="w-20 h-20 mx-auto rounded-3xl bg-green-100 text-green-700 flex items-center justify-center mb-6">
          <Sprout className="w-10 h-10" />
        </span>
        <h1 className="text-6xl text-green-700 mb-2 font-black">404</h1>
        <h2 className="text-2xl text-slate-800 mb-3 font-bold">Page Not Found</h2>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has moved.
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
