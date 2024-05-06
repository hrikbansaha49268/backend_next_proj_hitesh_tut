'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user;

    return (
        <nav className="p-4 md:p-6 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
                    Mystery Mongerer
                </Link>
                {session ? (
                    <>
                        <span className="mr-4">
                            Welcome, {user.username || user.email}
                        </span>
                        <div className='flex gap-x-4'>
                            <Link href="/dashboard" className="w-full md:w-auto bg-black text-white flex items-center px-8 rounded-lg">
                                Go to dashboard
                            </Link>
                            <Button
                                onClick={() => signOut()}
                                className="w-full md:w-auto bg-slate-100 text-black"
                                variant='outline'>
                                Logout
                            </Button>
                        </div>
                    </>
                ) : (
                    <Link href="/sign-in">
                        <Button
                            className="w-full md:w-auto bg-black text-white"
                            variant={'outline'}>
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;