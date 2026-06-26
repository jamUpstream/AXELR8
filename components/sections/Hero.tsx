"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/70" />
        <div className="absolute inset-0 z-10 grid-overlay opacity-60" />
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/background/background.jpg')",
          }}
        />
      </div>

      <div className="relative z-20 mx-auto max-w-5xl px-margin-mobile text-center md:px-margin-desktop">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-6 font-inter text-headline-lg-mobile font-bold tracking-tight md:text-headline-display"
        >
          AUTOMATE YOUR BUSINESS.
          <br />
          <span className="text-primary">ACCELERATE YOUR SUCCESS.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="mx-auto mb-12 max-w-2xl font-body-lg text-body-lg text-on-surface-variant"
        >
          Precision-engineered workflows designed for high-stakes scalability.
          We remove the friction from your operations so you can focus on the
          mission.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col justify-center gap-4 md:flex-row"
        >
          <Button href="/contact" variant="primary">
            Book a Call
          </Button>
          <Button href="/services" variant="outline">
            Learn More
          </Button>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-primary" />
      </div>
    </section>
  );
}
