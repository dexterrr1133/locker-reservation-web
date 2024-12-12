import Header from "@/components/header";

export default function DashboardLayout({ 
    children 
  }: { 
    children: React.ReactNode 
  }) {
    return (
      <div className="">
        <Header />
        <div className="">
       
          <main className="">
            {children}
          </main>
        </div>
      </div>
    );
  }