'use client'
import { useState, useEffect } from 'react'

export function useModal() {
  const [modal, setModal] = useState(null)

  const showAlert = (message) => {
    return new Promise((resolve) => {
      setModal({ type: 'alert', message, resolve })
    })
  }

  const showConfirm = (message) => {
    return new Promise((resolve) => {
      setModal({ type: 'confirm', message, resolve })
    })
  }

  const close = (result) => {
    modal?.resolve(result)
    setModal(null)
  }

  const ModalComponent = modal ? (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
        <p className="text-sm text-gray-700 mb-6">{modal.message}</p>
        <div className="flex gap-3 justify-end">
          {modal.type === 'confirm' && (
            <button onClick={() => close(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
          )}
          <button onClick={() => close(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition">
            OK
          </button>
        </div>
      </div>
    </div>
  ) : null

  return { showAlert, showConfirm, ModalComponent }
}