"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import NextLink from "next/link";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const issues = [
    {
      text: "Titel mit Umlauten erzeugen fehlerhafte Slugs und können nicht korrekt aufgerufen werden.",
      status: "Offen",
      style: "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100",
    },
    {
      text: "Mobile Darstellung wird noch optimiert.",
      status: "Offen",
      style: "bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100",
    },
    {
      text: "Sparziel-Bearbeitung ermöglichen",
      status: "Geplant",
      style: "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100",
    },
  ];

  return (
    <>
      <HeroUINavbar maxWidth="lg" position="sticky">
        {/* Branding mit Badge */}
        <NavbarContent justify="start">
          <div className="relative inline-flex">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <p className="font-bold text-inherit">TRESO</p>
            </NextLink>
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              α
            </span>
          </div>
        </NavbarContent>

        {/* Desktop actions */}
        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem className="hidden sm:flex gap-2 items-center">
            <Button
              variant="solid"
              color="success"
              aria-label="Fehler oder Bugs anzeigen"
              onClick={() => setIsOpen(true)}
            >
            Roadmap
            </Button>
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>

        {/* Mobile actions */}
        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>
      </HeroUINavbar>

      {/* Fehler-/Bug-Modal */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <ModalContent className="max-w-3xl">
          <ModalHeader>Roadmap</ModalHeader>
          <ModalBody className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <ul className="space-y-2">
              {issues.map((issue, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded"
                >
                  <span className="text-sm">{issue.text}</span>
                  <button
                    disabled
                    className={`text-xs font-medium px-3 py-1 rounded pointer-events-none cursor-default ${issue.style}`}
                  >
                    {issue.status}
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 text-center pt-4">
              Danke für dein Verständnis – wir arbeiten an Verbesserungen 🚀
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setIsOpen(false)}>
              Schließen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
