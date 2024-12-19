'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';

export default function SearchInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle cmd+k / ctrl+k keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // Handle escape key to close search
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add your search logic here
    console.log('Searching for:', query);
  };

  return (
    <div className="w-full space-y-2 relative">
      {!isOpen ? (
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
          onClick={() => setIsOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          Search...
          <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      ) : (
        <div className="absolute top-0 left-0 w-full">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-9"
            autoFocus
            onBlur={() => {
              // Small delay to allow for click events to fire
              setTimeout(() => setIsOpen(false), 200);
            }}
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}