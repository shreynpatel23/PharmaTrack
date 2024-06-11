"use client";
import { useRouter } from "next/navigation";
import Button from "./components/button";
import Input from "./components/input";
import Image from "next/image";
import Link from "next/link";
import ArrowRight from "./components/icons/ArrowRight";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <header className="px-8 py-6 bg-transparent flex items-center">
        <Link href={"/"}>
          <Image
            src="/logo.svg"
            alt="Logo of PharmaTrack"
            className="h-8"
            width={150}
            height={30}
            priority
          />
        </Link>
        <nav className="ml-auto">
          <ul className="flex items-center gap-12">
            <li className="list-none">
              <a
                href="#home"
                className="no-underline text-base leading-4 font-regular hover:font-medium text-black hover:text-accent"
              >
                Home
              </a>
            </li>
            <li className="list-none">
              <a
                href="#why-us"
                className="no-underline text-base leading-4 font-regular hover:font-medium text-black hover:text-accent"
              >
                Why Us
              </a>
            </li>
            <li className="list-none">
              <a
                href="#key-features"
                className="no-underline text-base leading-4 font-regular hover:font-medium text-black hover:text-accent"
              >
                Key Features
              </a>
            </li>
            <li className="list-none">
              <a
                href="#contact-us"
                className="no-underline text-base leading-4 font-regular hover:font-medium text-black hover:text-accent"
              >
                Contact Us
              </a>
            </li>
            <Button
              buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white"
              buttonText="Get Started"
              hasIcon={false}
              onClick={() => router.push("/login")}
            />
          </ul>
        </nav>
      </header>
      <main
        className="h-[80vh] my-12 w-full flex items-center justify-center"
        id="#home"
      >
        <div className="w-[50%] max-w-[550px] mx-auto">
          <h1 className="font-workSans text-4xl leading-[150%] text-black mb-4">
            Streamline Your Pharmacy Operations with{" "}
            <span className="font-medium text-accent">PharmaTrack</span>
          </h1>
          <p className="text-base leading-[180%] mb-8 text-black">
            Managing inventory in a pharmacy can be a complex and time-consuming
            task. With PharmaTrack, you can simplify and optimize your inventory
            processes, ensuring you have the right stock at the right time.
          </p>
          <Button
            buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white"
            buttonText="Get Started"
            onClick={() => router.push("/login")}
            hasIcon
            icon={<ArrowRight width="24" height="24" fill="white" />}
          />
        </div>
        <div className="w-[50%]">
          <Image
            src="/hero-image.svg"
            alt="Hero Image of orders page to show the ui of the application"
            width={896}
            height={646}
            priority
          />
        </div>
      </main>
      <section id="why-us" className="my-16">
        <h2 className="text-2xl font-workSans leading-6 text-black text-center py-4">
          Why Choose Pharmatrack
        </h2>
        <div className="py-8 flex items-start justify-center gap-12">
          <div className="p-4 w-[300px] h-[320px] bg-white border border-grey rounded-md text-center">
            <div className="py-6 flex justify-center h-[150px]">
              <img
                src="/Pharmacy-Store.svg"
                alt="Pharmacy Icon for Service Card"
                className="w-full h-auto"
              />
            </div>
            <h4 className="text-lg leading-4 text-black font-workSans text-center mt-2">
              Tailored for Pharmacies
            </h4>
            <p className="mt-4 text-sm leading-5 text-grey text-center">
              Tailored for pharmacies, PharmaTrack handles low stock count and
              controlled substances with specialized inventory management.
            </p>
          </div>
          <div className="p-4 w-[300px] h-[320px] bg-white border border-grey rounded-md text-center">
            <div className="py-6 flex justify-center h-[150px]">
              <img
                src="/tracking.svg"
                alt="Inventory tracking for Service Card"
                className="w-full h-auto"
              />
            </div>
            <h4 className="text-lg leading-4 text-black font-workSans text-center mt-2">
              Real-Time Inventory Tracking
            </h4>
            <p className="mt-4 text-sm leading-5 text-grey text-center">
              Keep shelves stocked without over-ordering; PharmaTrack offers
              real-time inventory updates, ensuring you know stock levels and
              reordering needs.
            </p>
          </div>
          <div className="p-4 w-[300px] h-[320px] bg-white border border-grey rounded-md text-center">
            <div className="py-6 flex justify-center h-[150px]">
              <img
                src="/Pos-System.svg"
                alt="Integrate POS System Easily for Service Card"
                className="w-full h-auto"
              />
            </div>
            <h4 className="text-lg leading-4 text-black font-workSans text-center mt-2">
              Integration with POS Systems
            </h4>
            <p className="mt-4 text-sm leading-5 text-grey text-center">
              Seamlessly integrate with POS for instant, accurate sales data
              reflection in inventory counts.
            </p>
          </div>
          <div className="p-4 w-[300px] h-[320px] bg-white border border-grey rounded-md text-center">
            <div className="py-6 flex justify-center h-[150px]">
              <img
                src="/Cloud.svg"
                alt="Cloud icon for Service Card"
                className="w-full h-auto"
              />
            </div>
            <h4 className="text-lg leading-4 text-black font-workSans text-center mt-2">
              User-Friendly Interface
            </h4>
            <p className="mt-4 text-sm leading-5 text-grey text-center">
              Intuitive, user-friendly interface enables quick learning,
              minimizing disruption, and maximizing efficiency for staff.
            </p>
          </div>
        </div>
      </section>
      <section id="key-features" className="mx-8 my-16">
        <div className="p-4">
          <div className="bg-orange shadow-card rounded-[16px] flex items-start">
            <div className="w-[40%] px-12 py-16">
              <p className="text-md leading-md font-workSans text-heading">
                Key Features
              </p>
              <div className="flex items-start gap-4 mt-12">
                <img
                  src="/Check-circle-outline.svg"
                  alt="Check mark icon for features Card"
                  className="w-[30px]"
                />
                <div className="flex flex-col items-start gap-2">
                  <h3 className="text-xl leading-5 font-workSans font-medium text-black">
                    Dashboard Overview
                  </h3>
                  <p className="text-md leading-md text-heading">
                    Instantly see net revenue, total orders, and low stock
                    counts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 mt-12">
                <img
                  src="/Check-circle-outline.svg"
                  alt="Check mark icon for features Card"
                  className="w-[30px]"
                />
                <div className="flex flex-col items-start gap-2">
                  <h3 className="text-xl leading-5 font-workSans font-medium text-black">
                    Product Management
                  </h3>
                  <p className="text-md leading-md text-heading">
                    View current quantities and prices of all products. Check
                    for products having low quantities.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 mt-12">
                <img
                  src="/Check-circle-outline.svg"
                  alt="Check mark icon for features Card"
                  className="w-[30px]"
                />
                <div className="flex flex-col items-start gap-2">
                  <h3 className="text-xl leading-5 font-workSans font-medium text-black">
                    Supplier Management
                  </h3>
                  <p className="text-md leading-md text-heading">
                    Easily create and manage suppliers for creating purchase
                    orders.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 mt-12">
                <img
                  src="/Check-circle-outline.svg"
                  alt="Check mark icon for features Card"
                  className="w-[30px]"
                />
                <div className="flex flex-col items-start gap-2">
                  <h3 className="text-xl leading-5 font-workSans font-medium text-black">
                    User Management
                  </h3>
                  <p className="text-md leading-md text-heading">
                    Control access with robust user role and permission
                    settings.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[60%]">
              <img
                src="/Dashboard-landing.svg"
                alt="Landing Page Dashboard Snapshot"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="my-20 p-8 bg-accentBlue text-center text-white">
        <p className="text-md font-medium pt-4">
          Experience the PharmaTrack Advantage
        </p>
        <p className="pt-8 text-sm leading-sm max-w-[60%] mx-auto">
          Join the growing number of pharmacies that are transforming their
          inventory management with PharmaTrack. Our dedicated support team is
          here to assist you every step of the way, ensuring a smooth transition
          and continuous improvement of your inventory processes.
        </p>
        <p className="py-6 text-3xl leading-3xl font-medium font-workSans">
          Get Started with PharmaTrack Today!
        </p>
        <p className="pb-6 text-sm leading-sm max-w-[60%] mx-auto">
          Empower your pharmacy with the tools it needs to operate efficiently
          and effectively. Contact us for a demo or start your free trial now
          and see how PharmaTrack can revolutionize your inventory management.
        </p>
        <div className="flex justify-center py-6">
          <Button
            buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white"
            buttonText="Get Started"
            onClick={() => router.push("/login")}
            hasIcon
            icon={<ArrowRight width="24" height="24" fill="white" />}
          />
        </div>
      </section>
      <section id="contact-us" className="my-16">
        <div className="bg-white border border-grey rounded-[16px] shadow-card p-8 max-w-[60%] mx-auto">
          <h2 className="text-2xl font-workSans leading-6 text-black text-center py-4">
            Contact Us
          </h2>
          <p className="text-sm leading-5 text-grey text-center">
            For more information or to schedule a demo, reach out to us
          </p>
          <div className="pt-6 flex items-start">
            <div className="w-[50%] px-8">
              <Input
                type="text"
                hasLabel
                label="Full Name"
                placeholder="Enter your Full Name"
              />
              <Input
                type="email"
                hasLabel
                label="Email"
                placeholder="Enter your email address"
              />
              <Input
                type="text"
                hasLabel
                label="Message"
                placeholder="Enter your message"
              />
              <div className="flex items-center gap-6 my-8">
                <Button
                  buttonClassName="rounded-md bg-transparent hover:bg-accent text-accent hover:text-white"
                  buttonText="Reset"
                  onClick={() => console.log("Reset")}
                />
                <Button
                  buttonClassName="rounded-md shadow-button hover:shadow-buttonHover bg-accent hover:bg-accentHover text-white"
                  buttonText="Send Message"
                  onClick={() => console.log("Reset")}
                />
              </div>
            </div>
            <div className="w-[50%] px-8 pt-4">
              <div className="my-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center">
                  <img
                    src="/Phone.svg"
                    alt="Phone Icon for Pharmatrack"
                    className="w-[20px]"
                  />
                </div>
                <p className="text-base leading-base text-black">
                  +1 343-558-7428
                </p>
              </div>
              <div className="my-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center">
                  <img
                    src="/Email.svg"
                    alt="Email Icon for Pharmatrack"
                    className="w-[20px]"
                  />
                </div>
                <p className="text-base leading-base text-black">
                  info@pharmatrack.com
                </p>
              </div>
              <div className="my-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center">
                  <img
                    src="/Location.svg"
                    alt="Location Icon for Pharmatrack"
                    className="w-[20px]"
                  />
                </div>
                <p className="text-base leading-base text-black">
                  3525, Brandon Gate Dr, <br /> Mississauga ON, L4T 3M3
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="p-6 bg-black text-white text-base leading-base text-center font-semibold">
        © All rights reserved 2024
      </footer>
    </>
  );
}
