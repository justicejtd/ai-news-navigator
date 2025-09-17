"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FilterRail, FilterRailProps } from "@components/home/FilterRail";

export type FiltersSheetProps = Omit<FilterRailProps, "className"> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FiltersSheet({ open, onOpenChange, ...filterProps }: FiltersSheetProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onOpenChange}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/70" />
        </Transition.Child>

        <div className="fixed inset-x-0 bottom-0 flex w-full justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="ease-in duration-150"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            <Dialog.Panel className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl">
              <div className="mx-auto h-1 w-16 rounded-full bg-white/20" />
              <div className="mt-4 max-h-[70vh] overflow-y-auto pb-6">
                <FilterRail {...filterProps} />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
