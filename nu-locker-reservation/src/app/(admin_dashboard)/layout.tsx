import Header from "@/components/features/header";

export default function AdminLayout({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {
    return (
      <div className="">
    
        <div className="">
       
          <main className="">
            {children}
          </main>
        </div>
      </div>
    );
  }