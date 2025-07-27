"use client"

import * as Dialog from "@radix-ui/react-dialog"

export default function TestRawRadix() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Raw Radix Dialog Test</h1>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Open Raw Radix Dialog</button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <Dialog.Title className="text-xl font-bold mb-4">Raw Radix Dialog</Dialog.Title>
            <Dialog.Description className="text-gray-600 mb-4">
              This is using raw Radix UI components without our custom wrapper.
            </Dialog.Description>
            <Dialog.Close asChild>
              <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Close</button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
