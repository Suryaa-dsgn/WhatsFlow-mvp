'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page
    router.push('/landing');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-whatsapp mb-4">WhatsFlow</h1>
        <p className="text-gray-600 mb-8">Redirecting to landing page...</p>
        <Link 
          href="/landing" 
          className="bg-whatsapp text-white px-6 py-3 rounded-lg shadow hover:bg-whatsapp-dark transition-all"
        >
          Go to Landing Page
        </Link>
      </div>
    </div>
  );
} 