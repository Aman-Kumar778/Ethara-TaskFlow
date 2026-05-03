import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Button from "../components/Button";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <div className="mb-8 rounded-full bg-primary-50 p-6 text-primary-600">
        <AlertCircle size={64} />
      </div>
      <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <p className="mt-4 text-xl font-bold text-slate-900">Page not found</p>
      <p className="mt-2 text-slate-500 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link to="/dashboard" className="mt-8">
        <Button>
          <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
