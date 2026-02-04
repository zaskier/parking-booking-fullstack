import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="mb-4 text-4xl font-bold text-gray-900">404</h2>
      <p className="mb-8 text-xl text-gray-600">Page not found</p>
      <Link
        href="/"
        className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
        Return Home
      </Link>
    </div>
  );
}
