import Header from '@/components/features/header';
import Head from 'next/head';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <>
      <Header />
      <Head>
        <title>FAQ Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen p-10">
        <div className="container mx-auto">
          <div className="flex flex-row justify-center border">
            {/* FAQ Section */}
            <div className="text-left w-full p-10">
              <h1 className="font-bold text-4xl mb-1">Got questions?</h1>
              <p className="text-sm mb-8">Some frequently asked questions</p>

                {/* FAQ Items */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It comes with default styles that matches the other
                      components&apos; aesthetic.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is it animated?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It&apos;s animated by default, but you can disable it if you
                      prefer.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </div>
            {/* Sign-up Section */}
          </div>
        </div>
      </div>
    </>
  );
}