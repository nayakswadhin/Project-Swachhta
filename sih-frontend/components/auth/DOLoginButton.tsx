import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

export function DOLoginButton() {
  return (
    <Link href="/do/login">
      <Button 
        className="bg-blue-600/90 hover:bg-blue-700 text-white font-medium flex items-center justify-center space-x-2 transform hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl py-3 px-6"
      >
        <UserCircle className="h-4 w-4" />
        <span>Divisional Officer Login</span>
      </Button>
    </Link>
  );
}