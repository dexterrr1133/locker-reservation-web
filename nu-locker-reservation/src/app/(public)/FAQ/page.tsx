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
                    <AccordionTrigger>How do I reserve a locker?</AccordionTrigger>
                    <AccordionContent>
                    To reserve a locker, log in to your account, browse the available lockers, and click the "Reserve" button for your preferred locker.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How long is the reservation valid?</AccordionTrigger>
                    <AccordionContent>
                    Lockers can be reserved for one semester at a time. At the end of the semester, you will need to renew your reservation.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Are there any items I’m not allowed to store in the locker?</AccordionTrigger>
                    <AccordionContent>
                    Yes, you are not allowed to store prohibited items such as hazardous materials, illegal substances, or perishable food.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Are there any items I’m not allowed to store in the locker?</AccordionTrigger>
                    <AccordionContent>
                    Yes, you are not allowed to store prohibited items such as hazardous materials, illegal substances, or perishable food.
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