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
                    <AccordionTrigger>WHO CAN USE THIS SKIBIDI STORAGE?</AccordionTrigger>
                    <AccordionContent>
                    Only real ones with university ID can participate fr fr (students and teachers) NO NPC ENERGY ALLOWED
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>WHAT'S BANNED FROM THE BACKROOMS? </AccordionTrigger>
                    <AccordionContent>
                    No food (rizz will expire)<br></br>
                    No crazy chemical stuff (not that kind of breaking bad)<br></br>
                    No expensive drip (university ain't responsible for stolen grail pieces)<br></br>
                    Nothing illegal (don't rizz yourself into jail fr fr)
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>WHAT IS THE REFUND POLICY FOR THE PAPER CHASERS 💰</AccordionTrigger>
                    <AccordionContent>
                    First 48 hours: Full refund (zero rizz lost)<br></br>
                    First two weeks: Half refund (mid rizz energy)<br></br>
                    After that: No refund (L + ratio)
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